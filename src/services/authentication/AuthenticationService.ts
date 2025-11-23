import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../account/AccountService';
import { IAuthGoogleUser } from '../../types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  constructor(
    private accountService: AccountService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async oAuthLogin(googleUser: IAuthGoogleUser): Promise<{ jwt: string }> {
    if (!googleUser || !googleUser.email) {
      throw new UnauthorizedException('google_user_not_found');
    }

    const user = await this.accountService.findOrCreateAccount(googleUser);

    const payload = {
      email: user.email,
      sub: user._id.toHexString(),
    };

    const jwt = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });

    return { jwt };
  }
}
