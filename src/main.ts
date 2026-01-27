// src/main.ts
import 'dotenv-flow/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);

  // Swagger の設定構築
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.title') || 'NestJS API')
    .setDescription(configService.get<string>('swagger.description') || '')
    .setVersion(configService.get<string>('swagger.version') || '1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // production 環境以外（development, devcontainer 等）の場合のみ Swagger UI を公開
  if (configService.get('app.env') !== 'production') {
    SwaggerModule.setup('swagger', app, document);
  }

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);
}
void bootstrap();
