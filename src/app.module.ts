import { Module } from '@nestjs/common';
import { FalsificationController } from './controllers/falsification/FalsificationController';
import { FalsificationService } from './services/falsification/FalsificationService';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppDb } from './database/AppDatabase';
import { FalsificationRepository } from './repositories/falsification/FalsificationRepository';
import { AccountRepository } from './repositories/account/AccountRepository';
import { AccountService } from './services/account/AccountService';
import { AuthenticationService } from './services/authentication/AuthenticationService';
import { GoogleStrategy } from './services/authentication/GoogleStrategy';
import { JwtStrategy } from './services/authentication/JwtStrategy';
import { GoogleOauthGuard } from './guards/GoogleOauthGuard';
import { JwtGuard } from './guards/JwtGuard';
import { AuthenticationController } from './controllers/authentication/AuthenticationController';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [FalsificationController, AuthenticationController],
  providers: [
    // core
    AppDb,

    // guards
    GoogleOauthGuard,
    JwtGuard,

    // auth
    GoogleStrategy,
    JwtStrategy,

    // services
    FalsificationService,
    ConfigService,
    AccountService,
    AuthenticationService,
    JwtService,

    // repositories
    FalsificationRepository,
    AccountRepository,
  ],
})
export class AppModule {}
