import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GoogleOauthGuard } from '../../guards/GoogleOauthGuard';
import { AuthenticationService } from '../../services/authentication/AuthenticationService';

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

      res.redirect(`${frontendUrl}?token=${jwtToken}`);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'google_auth_error: ' + err.message,
      });
    }
  }
}
