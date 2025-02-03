import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../../drizzle/drizzle.service';
import { refreshToken, users } from '../../drizzle/schema';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly db: DrizzleService) {}

  findByUserId(userId: number) {
    return this.db.conn.query.refreshToken.findFirst({
      where: (refreshToken) => eq(refreshToken.userId, userId),
    });
  }

  delete(refreshTokenId: number) {
    return this.db.conn
      .delete(refreshToken)
      .where(eq(refreshToken.id, refreshTokenId));
  }

  create(params: { userId: number; expiresAt: Date; refreshToken: string }) {
    return this.db.conn.insert(refreshToken).values({
      refreshToken: params.refreshToken,
      userId: params.userId,
      expiresAt: params.expiresAt,
    });
  }

  async findByRefreshToken(refreshTokenValue: string) {
    return (
      await this.db.conn
        .select()
        .from(refreshToken)
        .where((refreshToken) =>
          eq(refreshToken.refreshToken, refreshTokenValue),
        )
        .rightJoin(users, eq(refreshToken.userId, users.id))
    )[0];
  }
}
