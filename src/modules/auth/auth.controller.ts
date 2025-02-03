import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AllowUnauthorizedRequest } from './allow-unauthorized-request';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SendForgotPasswordTokenDto } from './dto/send-forgot-password-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerificationDto } from './dto/verification.dto';
import { UserDto } from '../users/dto/user.dto';
import { LoginResDto } from './dto/login-res.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { AppleAuthDto } from './dto/apple-auth.dto';
import { ConfigService } from '@nestjs/config';
import { FacebookAuthDto } from './dto/facebook-auth.dto';
import { FacebookAuthGuard } from './guards/facebook-oauth.guard';
import { v4 as uuidv4 } from 'uuid';
import { createHmac } from 'crypto';
import { GoogleAuthDto } from './dto/google-auth.dto';

@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @AllowUnauthorizedRequest()
  @ApiOperation({ summary: 'User Registration' })
  @ApiBody({
    type: () => AuthDto,
    examples: {
      example: {
        value: {
          email: 'user@example.com',
          password: 'password123',
          fullName: 'John Doe',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: () => UserDto,
  })
  @Post('register')
  async register(@Body() body: AuthDto) {
    return this.authService.register(body.email, body.password, body.fullName);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @AllowUnauthorizedRequest()
  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    type: () => AuthDto,
    examples: {
      example: {
        value: { email: 'user@example.com', password: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: () => LoginResDto,
  })
  @Post('login')
  async login(@Body() body: AuthDto, @Res({ passthrough: true }) res) {
    const { accessToken, userDto, refreshToken } = await this.authService.login(
      body.email,
      body.password,
    );
    res.header('refresh_token', `Bearer ${refreshToken}`);
    return { accessToken, user: userDto };
  }

  @AllowUnauthorizedRequest()
  @Post('apple')
  async appleLoginCallback(
    @Body() body: AppleAuthDto,
    @Res({ passthrough: true }) res,
  ) {
    const { accessToken, userDto, refreshToken } =
      await this.authService.appleLogin(
        body.identityToken,
        body.nonce,
        body.fullName,
      );
    res.header('refresh_token', `Bearer ${refreshToken}`);
    return { accessToken, refreshToken, user: userDto };
  }

  @AllowUnauthorizedRequest()
  @Post('facebook')
  @ApiOperation({ summary: 'Login with Facebook access token' })
  @ApiResponse({
    status: 200,
    description: 'Facebook login successful',
    type: LoginResDto,
  })
  async facebookLogin(
    @Body() body: FacebookAuthDto,
    @Res({ passthrough: true }) res,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.facebookLogin(body.accessToken);

    res.header('refresh_token', `Bearer ${refreshToken}`);

    return { accessToken, refreshToken, user };
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  @AllowUnauthorizedRequest()
  @ApiOperation({ summary: 'Initiate Facebook OAuth flow' })
  async facebookAuth() {
    // Guard handles the redirect to Facebook
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  @AllowUnauthorizedRequest()
  @ApiOperation({ summary: 'Facebook OAuth callback' })
  @Redirect()
  async facebookAuthCallback(@Req() req) {
    const { accessToken, refreshToken, user } =
      await this.authService.facebookLogin(req.user.accessToken);

    // Create redirect URL with tokens
    const url = new URL(`${this.configService.get('APP_NAME')}://login`);
    url.searchParams.append('accessToken', accessToken);
    url.searchParams.append('refreshToken', refreshToken);
    url.searchParams.append('userId', user.id.toString());

    return { url: url.href };
  }

  @Get('facebook/delete')
  async handleDataDeletion(@Query('signed_request') signedRequest: string) {
    // Your Facebook App Secret
    const appSecret = process.env.FACEBOOK_APP_SECRET;

    if (!signedRequest) {
      throw new HttpException(
        'Signed request is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Parse the signed request
    const [encodedSig, payload] = signedRequest.split('.');

    const sig = this.base64UrlDecode(encodedSig);
    const data = JSON.parse(this.base64UrlDecode(payload).toString());

    // Verify the algorithm
    if (data.algorithm.toUpperCase() !== 'HMAC-SHA256') {
      throw new HttpException('Unknown algorithm', HttpStatus.BAD_REQUEST);
    }

    // Verify the signature
    const expectedSig = createHmac('sha256', appSecret)
      .update(payload)
      .digest();

    if (!sig.equals(expectedSig)) {
      throw new HttpException('Invalid signature', HttpStatus.BAD_REQUEST);
    }

    // Data is verified at this point
    const userId = data.user_id;

    // Proceed to delete the user data
    await this.authService.deleteUserData(userId);

    // Return the required response
    const confirmationCode = uuidv4();
    const url = `https://api.focusonapp.com/api/auth/data-deletion-status?code=${confirmationCode}`;

    return {
      url: url,
      confirmation_code: confirmationCode,
    };
  }

  private base64UrlDecode(str: string): Buffer {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

    // Pad with '='
    while (base64.length % 4) {
      base64 += '=';
    }

    return Buffer.from(base64, 'base64');
  }

  @Get('data-deletion-status')
  async dataDeletionStatus(@Query('code') code: string) {
    if (!code) {
      throw new HttpException(
        'Confirmation code is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'Data deletion confirmed',
    };
  }

  @AllowUnauthorizedRequest()
  @ApiOperation({ summary: 'Refresh Access Token using Refresh Token' })
  @ApiHeader({
    name: 'Header',
    description: 'Refresh Token header',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
    type: () => LoginResDto,
  })
  @Post('token/refresh')
  async refreshToken(@Req() req, @Res({ passthrough: true }) res) {
    const refreshTokenFromHeader = req.header('refresh_token');
    console.log(refreshTokenFromHeader, 'refresh_token');
    let refreshToken = '';
    if (refreshTokenFromHeader) {
      refreshToken = refreshTokenFromHeader.replace('Bearer ', '');
    }
    if (typeof refreshToken === 'string') {
      const data = await this.authService.refreshToken(refreshToken);
      res.header('refresh_token', `Bearer ${data.refreshToken}`);
      return { accessToken: data.accessToken, user: data.userDto };
    }
    throw new UnauthorizedException();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({
    type: () => ({
      userId: Number,
    }),
    examples: {
      example: {
        value: { userId: 1 },
      },
    },
  })
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @Post('logout')
  async logout(@Body() body: LogoutDto, @Res({ passthrough: true }) res) {
    res.header('Authorization', '');
    res.header('refresh_token', '');
    return this.authService.logout(body.userId);
  }

  @AllowUnauthorizedRequest()
  @ApiOperation({ summary: 'Request to reset password' })
  @ApiBody({
    type: () => ForgotPasswordDto,
    examples: {
      example: {
        value: { email: 'user@example.com' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset requested successfully',
  })
  @Post('password/forgot')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @AllowUnauthorizedRequest()
  @ApiOperation({ summary: 'Verify reset code for password reset' })
  @ApiBody({
    type: () => SendForgotPasswordTokenDto,
    examples: {
      example: {
        value: { email: 'user@example.com', resetCode: 'some code' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Code verified successfully' })
  @Post('password/verify/code')
  async verifyCode(@Body() body: SendForgotPasswordTokenDto) {
    return this.authService.verifyCode(body.email, body.resetCode);
  }

  @AllowUnauthorizedRequest()
  @ApiOperation({ summary: 'Change password after reset' })
  @ApiBody({
    type: () => ChangePasswordDto,
    examples: {
      example: {
        value: { email: 'user@example.com', password: 'new password' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @Post('password/reset')
  async changePassword(@Body() body: ChangePasswordDto) {
    return this.authService.changePassword({
      email: body.email,
      newPassword: body.password,
    });
  }

  @AllowUnauthorizedRequest()
  @ApiOperation({ summary: 'Verify User by code' })
  @ApiBody({
    type: () => VerificationDto,
    examples: {
      example: {
        value: { email: 'user@example.com', verificationCode: 'some code' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Code verified successfully' })
  @Post('verify/confirm')
  async verifyEmailConfirm(@Body() body: VerificationDto) {
    return this.authService.verifyEmailConfirm(
      body.email,
      body.verificationCode,
    );
  }

  @AllowUnauthorizedRequest()
  @ApiOperation({ summary: 'Resend verification code' })
  @ApiBody({
    type: () => ResendVerificationDto,
    examples: {
      example: {
        value: { email: 'user@example.com' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Code sent successfully' })
  @Post('verification/resend')
  resendVerificationEmail(@Body() body: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(body.email);
  }

  @Post('google')
  @AllowUnauthorizedRequest()
  async googleLogin(@Body() googleAuthDto: GoogleAuthDto) {
    const { accessToken, userDto, refreshToken } =
      await this.authService.googleLogin(googleAuthDto.idToken);

    return {
      accessToken,
      refreshToken,
      user: userDto,
    };
  }
}
