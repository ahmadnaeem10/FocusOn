import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const base = configService.get('GOOGLE_APP_REDIRECT_HOST');
    const callbackURL = new URL('/api/auth/google/callback', base);
    super({
      clientID: configService.get('GOOGLE_APP_ID'),
      clientSecret: configService.get('GOOGLE_APP_SECRET'),
      callbackURL: callbackURL.href,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id, name, emails, photos } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
    };

    return user;
  }
}
