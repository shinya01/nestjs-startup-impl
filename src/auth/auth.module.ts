import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { CognitoStrategy } from './strategies';
import { CognitoAuthGuard } from './guards';

@Module({
  imports: [ConfigModule, PassportModule.register({})],
  providers: [CognitoStrategy, CognitoAuthGuard],
  exports: [PassportModule, CognitoAuthGuard],
})
export class AuthModule {}
