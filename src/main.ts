import 'dotenv-flow/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { HttpExceptionFilter } from './common/filters';
import { ErrorResponseDto } from './common/swagger';

async function bootstrap() {
  // トランザクションコンテキストの初期化（最優先で実行）
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  // DTO のバリデーションをグローバルに適用
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTOに定義されていないプロパティを自動除外
      transform: true, // リクエストパラメータをDTOの型に自動変換
    }),
  );

  // 共通例外フィルターをグローバルに適用
  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.title') || 'NestJS API')
    .setDescription(configService.get<string>('swagger.description') || '')
    .setVersion(configService.get<string>('swagger.version') || '1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [ErrorResponseDto], // 追加モデルを登録
  });
  if (configService.get('app.env') !== 'production') {
    SwaggerModule.setup('swagger', app, document);
  }

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);
}
void bootstrap();
