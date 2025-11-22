import { Module } from '@nestjs/common';
import { FalsificationController } from './controllers/FalsificationController';
import { FalsificationService } from './services/FalsificationService';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppDb } from './database/AppDatabase';
import { FalsificationRepository } from './repositories/FalsificationRepository';

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
  ],
})
export class AppModule {}
