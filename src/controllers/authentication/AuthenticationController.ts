import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GoogleOauthGuard } from '../../guards/GoogleOauthGuard';
import { AuthenticationService } from '../../services/authentication/AuthenticationService';
import { JwtGuard } from '../../guards/JwtGuard';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private authService: AuthenticationService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() _req: Request) {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const tokenResult = await this.authService.oAuthLogin(req.user);
      const jwtToken = tokenResult.jwt;

      const frontendUrl = this.configService.get<string>(
        'FRONTEND_REDIRECT_URL',
      );

      res.cookie('jwt', jwtToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      res.redirect(frontendUrl);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'google_auth_error: ' + err.message,
      });
    }
  }

  @Get('status')
  @UseGuards(JwtGuard)
  async status(@Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('token_not_found');

    return {
      isAuthenticated: true,
      user: req.user,
    };
  }
}
