import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDataPayload } from './interface';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { DateUtil } from '../../utils/date-util/date.util';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';
import { BadRequestException } from '../../exception/bad-request.exception';
// import { readFile } from 'fs/promises';
// import * as path from 'path';
// import { compile } from 'handlebars';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private readonly passwordEncoder = bcrypt;
  private googleClient: OAuth2Client;
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {
    this.googleClient = new OAuth2Client({
      clientId: this.configService.get('GOOGLE_WEB_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_APP_SECRET'),
      redirectUri: 'com.focusonapp:/oauthredirect',
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    const isPasswordMatch = user
      ? await compare(password, user.password)
      : false;
    if (user && isPasswordMatch) {
      return user;
    }
    return undefined;
  }

  async register(email: string, password: string, fullName: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const newUser = await this.usersService.create({
      email,
      password,
      fullName,
    });
    const emailSent = await this.verifyEmail(email);
    if (!emailSent) {
      throw new BadRequestException('Error sending email');
    }

    return new UserDto(newUser);
  }

  async googleLogin(idToken: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: this.configService.get('GOOGLE_WEB_CLIENT_ID'),
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new UnauthorizedException('Invalid Google token');
    }

    let user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      user = await this.usersService.createProviderUser({
        email: payload.email,
        fullName: payload.name,
      });
    }

    const userRefreshToken = await this.refreshTokenService.findByUserId(
      user.id,
    );

    if (userRefreshToken) {
      await this.refreshTokenService.delete(userRefreshToken.id);
    }

    const { refreshToken } = await this.refreshTokenService.create({
      userId: user.id,
    });
    const accessToken = this.generateAccessToken(user.id);
    return {
      accessToken,
      refreshToken,
      userDto: user,
    };
  }

  async verifyEmail(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const verificationCode = this.generateResetCode();
      const expirationDate = this.calculateExpirationDate();
      await this.usersService.createVerificationCode({
        userId: user.id,
        code: verificationCode,
        expiresAt: expirationDate,
      });
      // const pathStr: string = await readFile(
      //   path.resolve(__dirname, 'templates', 'restore-code.hbs'),
      //   { encoding: 'utf8' },
      // );
      // const emailTemplate = compile(pathStr);
      await this.emailService.sendEmail(
        user.email,
        'Verify email',
        // emailTemplate({
        //   name: `${user.firstName} ${user.lastName}`,
        //   resetCode,
        //   email: user.email,
        // }),
        `Your verification code: ${verificationCode}`,
      );

      return true;
    }
    return false;
  }

  async verifyEmailConfirm(email: string, verificationCode: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    const code = await this.usersService.findVerificationCode(user.id);
    if (!code) {
      throw new BadRequestException(
        'Verification code does not exist for the user',
      );
    }
    if (
      code &&
      code.code === verificationCode &&
      this.isCodeValid(code.expiresAt)
    ) {
      await this.usersService.update({ ...user, verified: true });
      await this.usersService.deleteVerificationCode(user.id);
      return true;
    }
    return false;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    if (!user.verified) {
      throw new BadRequestException('User is not verified');
    }
    const isPassEqual = await this.passwordEncoder.compare(
      password,
      user.password,
    );
    if (!isPassEqual) {
      throw new BadRequestException('Wrong password');
    }
    const userRefreshToken = await this.refreshTokenService.findByUserId(
      user.id,
    );

    if (userRefreshToken) {
      await this.refreshTokenService.delete(userRefreshToken.id);
    }

    const { refreshToken } = await this.refreshTokenService.create({
      userId: user.id,
    });
    const userDto = new UserDto(user);
    const accessToken = this.generateAccessToken(user.id);

    return {
      accessToken,
      refreshToken,
      userDto,
    };
  }

  async appleLogin(identityToken: string, nonce: string, fullName?: string) {
    const client = jwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });

    try {
      const decodedToken = jwt.decode(identityToken, { complete: true });
      const kid = decodedToken.header.kid;

      const key = await client.getSigningKey(kid);
      const signingKey = key.getPublicKey();

      const hashedNonce = crypto
        .createHash('sha256')
        .update(nonce)
        .digest('hex');

      const payload = jwt.verify(identityToken, signingKey, {
        algorithms: ['RS256'],
        audience: this.configService.get('APPLE_CLIENT_ID'),
        issuer: 'https://appleid.apple.com',
        nonce: hashedNonce,
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const payloadEmail = payload.email;
      const user = await this.usersService.findByEmail(payloadEmail);

      if (!user) {
        const newUser = await this.usersService.create({
          email: payloadEmail,
          fullName: fullName,
          password: null,
          verified: true,
        });
        const userDto = new UserDto(newUser);
        const accessToken = this.generateAccessToken(newUser.id);
        const { refreshToken } = await this.refreshTokenService.create({
          userId: newUser.id,
        });
        return {
          accessToken,
          refreshToken,
          userDto,
        };
      } else {
        const userRefreshToken = await this.refreshTokenService.findByUserId(
          user.id,
        );
        if (userRefreshToken) {
          await this.refreshTokenService.delete(userRefreshToken.id);
        }
        const { refreshToken } = await this.refreshTokenService.create({
          userId: user.id,
        });
        const userDto = new UserDto(user);
        const accessToken = this.generateAccessToken(user.id);
        return {
          accessToken,
          refreshToken,
          userDto,
        };
      }
    } catch (error) {
      console.error('Apple token verification failed:', error);
      throw new UnauthorizedException(null, 'Apple token verification failed');
    }
  }

  async refreshToken(refreshToken: string) {
    const userRefreshToken = await this.refreshTokenService.findByRefreshToken(
      refreshToken,
    );
    if (!userRefreshToken) {
      throw new UnauthorizedException(null, 'Session does not exist');
    }
    if (DateUtil.isBeforeNow(userRefreshToken.refresh_token.expiresAt)) {
      await this.refreshTokenService.delete(userRefreshToken.refresh_token.id);
      throw new UnauthorizedException(null, 'Session expired');
    }

    await this.refreshTokenService.delete(userRefreshToken.refresh_token.id);
    const newRefreshToken = await this.refreshTokenService.create({
      userId: userRefreshToken.user.id,
    });
    const user = await this.usersService.findById(userRefreshToken.user.id);
    const userDto = new UserDto(user);
    const accessToken = this.generateAccessToken(userRefreshToken.user.id);

    return {
      accessToken: accessToken,
      refreshToken: newRefreshToken.refreshToken,
      userDto,
    };
  }

  async logout(userId: number) {
    const userRefreshToken = await this.refreshTokenService.findByUserId(
      userId,
    );
    await this.refreshTokenService.delete(userRefreshToken.id);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const code = await this.usersService.findPasswordCode(user.id);
      if (code) {
        await this.usersService.deletePasswordCode(user.id);
      }
      const resetCode = this.generateResetCode();
      const expirationDate = this.calculateExpirationDate();
      await this.usersService.createPasswordCode({
        userId: user.id,
        code: resetCode,
        expiresAt: expirationDate,
      });
      // const pathStr: string = await readFile(
      //   path.resolve(__dirname, 'templates', 'restore-code.hbs'),
      //   { encoding: 'utf8' },
      // );
      // const emailTemplate = compile(pathStr);
      await this.emailService.sendEmail(
        user.email,
        'Password reset code',
        // emailTemplate({
        //   name: `${user.firstName} ${user.lastName}`,
        //   resetCode,
        //   email: user.email,
        // }),
        `Your reset code: ${resetCode}`,
      );

      return true;
    }
    return false;
  }

  async verifyCode(email: string, resetCode: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    const code = await this.usersService.findPasswordCode(user.id);
    if (!code) {
      throw new BadRequestException('Reset code does not exist for the user');
    }
    return code && code.code === resetCode && this.isCodeValid(code.expiresAt);
  }

  async changePassword({
    newPassword,
    email,
  }: {
    email: string;
    newPassword: string;
  }) {
    const hashedPassword = await this.usersService.hashPassword(newPassword);
    const user = await this.usersService.findByEmail(email);
    const code = await this.usersService.findPasswordCode(user.id);
    if (code) {
      await this.usersService.deletePasswordCode(user.id);
    }
    return this.usersService.changePassword({
      password: hashedPassword,
      id: user.id,
    });
  }

  async resendVerificationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    const code = await this.usersService.findVerificationCode(user.id);
    if (code) {
      await this.usersService.deleteVerificationCode(user.id);
    }
    return this.verifyEmail(email);
  }

  private generateAccessToken(userId: number) {
    const jwtBody: JwtPayloadDataPayload = {
      userId,
    };
    return this.jwtService.sign(jwtBody);
  }

  private generateResetCode(): string {
    const length = 5;
    const characters = '0123456789';

    const randomBytesBuffer = randomBytes(length);
    let resetCode = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = randomBytesBuffer.readUInt8(i) % characters.length;
      resetCode += characters.charAt(randomIndex);
    }

    return resetCode;
  }

  private calculateExpirationDate(): Date {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);
    return expirationDate;
  }

  private isCodeValid(expirationDate: Date): boolean {
    return new Date() < expirationDate;
  }

  async facebookLogin(accessToken: string) {
    try {
      // Verify token and get user data from Facebook
      const { data } = await axios.get('https://graph.facebook.com/me', {
        params: {
          fields: 'id,name,email',
          access_token: accessToken,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Find or create user
      let user = await this.usersService.findByEmail(data.email);

      if (!user) {
        user = await this.usersService.create({
          email: data.email,
          fullName: data.name,
          password: null,
          verified: true,
        });
      }

      // Remove existing refresh token if any
      const userRefreshToken = await this.refreshTokenService.findByUserId(
        user.id,
      );
      if (userRefreshToken) {
        await this.refreshTokenService.delete(userRefreshToken.id);
      }

      // Generate new tokens
      const { refreshToken } = await this.refreshTokenService.create({
        userId: user.id,
      });

      const userDto = new UserDto(user);
      const jwtToken = this.generateAccessToken(user.id);

      return {
        accessToken: jwtToken,
        refreshToken,
        user: userDto,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Facebook authentication error:', {
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url,
          params: err.config?.params,
        });
        const fbError = err.response?.data?.error;
        if (fbError?.code === 190) {
          throw new UnauthorizedException('Invalid or expired Facebook token');
        } else if (fbError?.code === 104) {
          throw new UnauthorizedException('Invalid Facebook App credentials');
        }

        throw new UnauthorizedException(
          `Facebook authentication failed: ${
            fbError?.message || 'Unknown error'
          }`,
        );
      }
      throw new UnauthorizedException('Facebook authentication failed');
    }
  }

  async deleteUserData(userId: number) {
    await this.usersService.delete(userId);
  }
}
