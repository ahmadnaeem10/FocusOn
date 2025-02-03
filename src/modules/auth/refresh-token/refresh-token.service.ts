import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from './refresh-token.repository';
import { generateKeySync } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { DateUtil } from '../../../utils/date-util/date.util';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  findByUserId(userId: number) {
    return this.refreshTokenRepository.findByUserId(userId);
  }

  delete(refreshTokenId: number) {
    return this.refreshTokenRepository.delete(refreshTokenId);
  }

  async create(params: { userId: number }) {
    const { refreshToken, expiresAt } = this.generateRefreshToken();
    await this.refreshTokenRepository.create({
      refreshToken,
      userId: params.userId,
      expiresAt: expiresAt,
    });
    return { refreshToken, expiresAt };
  }

  findByRefreshToken(refreshToken: string) {
    return this.refreshTokenRepository.findByRefreshToken(refreshToken);
  }

  private generateRefreshToken() {
    const expiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRATION_TIME',
    );

    return {
      refreshToken: generateKeySync('hmac', { length: 64 })
        .export()
        .toString('hex'),
      expiresAt: DateUtil.addTime(Number(expiresIn), 'd'),
    };
  }
}
