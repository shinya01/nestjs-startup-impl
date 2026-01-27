// src/main.ts
import 'dotenv-flow/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  // Logger 初期化までのログを保持するため bufferLogs: true を指定
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // アプリケーション全体のロガーを nestjs-pino に差し替え
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);
}
void bootstrap();
