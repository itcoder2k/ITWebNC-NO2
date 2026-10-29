import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const uploadsDir = existsSync(resolve(process.cwd(), 'uploads'))
    ? resolve(process.cwd(), 'uploads')
    : resolve(process.cwd(), 'server', 'uploads');
  app.useStaticAssets(uploadsDir, { prefix: '/uploads/' });

  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Server is running on: http://localhost:${port}/api`);
}
await bootstrap();
