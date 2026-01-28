import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    // Passportの基本設定。session: false はJWT（ステートレス）認証であることを示す
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  providers: [
    // ※ ここに CognitoStrategy や Auth0Strategy を後ほど追加します
    // ※ ここに CognitoAuthGuard や Auth0AuthGuard を後ほど追加します
  ],
  exports: [PassportModule],
})
export class AuthModule {}
