import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { Auth0Strategy, CognitoStrategy } from './strategies';
import { Auth0AuthGuard, CognitoAuthGuard } from './guards';
import { UserModule } from '../user/user.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, PassportModule.register({}), HttpModule, UserModule],
  providers: [CognitoStrategy, CognitoAuthGuard, Auth0Strategy, Auth0AuthGuard],
  exports: [PassportModule, CognitoAuthGuard, Auth0AuthGuard],
})
export class AuthModule {}
