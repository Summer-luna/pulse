import { mkdirSync } from 'node:fs';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { UPLOADS_DIR } from './uploads/uploads.constants.js';

async function bootstrap() {
  mkdirSync(UPLOADS_DIR, { recursive: true });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useStaticAssets(UPLOADS_DIR, { prefix: '/uploads/' });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) =>
        new BadRequestException(errors.flatMap((error) => Object.values(error.constraints ?? {})).join('; ')),
    }),
  );
  await app.listen(process.env.PORT ?? 4000);
}
await bootstrap();
