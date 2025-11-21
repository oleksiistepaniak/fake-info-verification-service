import { Module } from '@nestjs/common';
import { FalsificationController } from './controllers/FalsificationController';

@Module({
  imports: [],
  controllers: [FalsificationController],
  providers: [],
})
export class AppModule {}
