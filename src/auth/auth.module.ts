import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, PassportModule.register({})],
  providers: [
    // ※ ここに CognitoStrategy や Auth0Strategy を後ほど追加します
    // ※ ここに CognitoAuthGuard や Auth0AuthGuard を後ほど追加します
  ],
  exports: [PassportModule],
})
export class AuthModule {}
