import { Module } from '@nestjs/common';
import { FalsificationController } from './controllers/FalsificationController';
import { FalsificationService } from './services/FalsificationService';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppDb } from './database/AppDatabase';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [FalsificationController],
  providers: [AppDb, FalsificationService, ConfigService],
})
export class AppModule {}
