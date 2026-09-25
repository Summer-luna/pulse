import { mkdirSync } from 'node:fs';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { UPLOADS_DIR } from './uploads/uploads.constants.js';

async function bootstrap() {
  mkdirSync(UPLOADS_DIR, { recursive: true });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Behind a reverse proxy (nginx in front of this container), trust its
  // X-Forwarded-* headers so req.protocol/req.get('host') reflect the
  // public-facing URL instead of the proxy's internal one.
  app.set('trust proxy', 1);
  const configuredOrigin = process.env.FRONTEND_ORIGIN;
  // Matches any http://<host>:5173 origin (localhost or a LAN IP) so the dev frontend
  // can be reached from other machines on the network without hardcoding an IP here.
  const LAN_DEV_ORIGIN = /^http:\/\/[\w.-]+:5173$/;
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || origin === configuredOrigin || LAN_DEV_ORIGIN.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      }
    },
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
