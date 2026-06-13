/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import helmet from 'helmet';

import { Logger } from 'nestjs-pino';

import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

import { setupSwagger } from './config/swagger.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);

  app.use(helmet());

  app.enableCors({
    origin: configService.get<string>('frontendUrl'),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  setupSwagger(app);

  const port = configService.get<number>('port') ?? 3001;

  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(
    `Application running on port ${port}`,
    'Bootstrap',
  );
}

void bootstrap();