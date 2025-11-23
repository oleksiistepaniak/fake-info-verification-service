import { Module } from '@nestjs/common';
import { FalsificationController } from './controllers/falsification/FalsificationController';
import { FalsificationService } from './services/falsification/FalsificationService';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppDb } from './database/AppDatabase';
import { FalsificationRepository } from './repositories/falsification/FalsificationRepository';
import { AccountRepository } from './repositories/account/AccountRepository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [FalsificationController],
  providers: [
    // core
    AppDb,

    // services
    FalsificationService,
    ConfigService,

    // repositories
    FalsificationRepository,
    AccountRepository,
  ],
})
export class AppModule {}
