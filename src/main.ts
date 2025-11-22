import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './exception-filters/AllExceptionFilter';
import { AppDb } from './database/AppDatabase';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionFilter());

  await new AppDb(new ConfigService()).initializeDatabase();

  await app.listen(3000);
}
bootstrap().catch((err: unknown) => console.log(err));
