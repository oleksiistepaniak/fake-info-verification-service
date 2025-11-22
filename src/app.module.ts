import { Module } from '@nestjs/common';
import { FalsificationController } from './controllers/FalsificationController';
import { FalsificationService } from './services/FalsificationService';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [FalsificationController],
  providers: [FalsificationService, ConfigService],
})
export class AppModule {}
