import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategyBase } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import type { SecretOrKeyProvider } from 'passport-jwt';
import { InvalidTokenException } from '../exceptions';
import { UserDto } from '../../user/dto';
import { UserService } from '../../user/user.service';
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { AuthUser } from '../types';

// CognitoのアクセストークンのClaimインターフェース
interface Claim {
  sub: string;
  iss: string;
  client_id: string;
  origin_jti: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  username: string;
}

@Injectable()
export class CognitoStrategy extends PassportStrategy(
  JwtStrategyBase,
  'cognito',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const jwksUri = configService.get<string>('jwt.jwksUri') || '';
    const issuer = configService.get<string>('jwt.issuer') || '';
    const jwksSecret: SecretOrKeyProvider = jwksRsa.passportJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri,
    });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksSecret,
      // audience, // IDPの仕様に合わせる。Cognitoの場合、claimにaudが含まれていないため、このタイミングでaudienceチェック不可。
      issuer,
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: Claim): Promise<AuthUser> {
    // req.user will be set to the return value of this method
    // You can customize the returned object as needed

    const sub = payload.sub;
    // Ensure the token is an access token
    if (!sub || payload.token_use !== 'access') {
      throw new InvalidTokenException();
    }
    // Cognito特有のクライアントID（audience）チェック
    const audience = this.configService.get<string>('jwt.audience') ?? '';
    if (payload.client_id !== audience) {
      throw new InvalidTokenException();
    }

    // ユーザ情報同期(登録)処理
    let user: UserDto | null = null;
    try {
      user = await this.userService.findByExternalId(sub);
    } catch {
      /* empty */
    }
    if (!user) {
      const client = new CognitoIdentityProviderClient({
        region: 'ap-northeast-1',
      });
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req) || '';
      const command = new GetUserCommand({
        AccessToken: token,
      });
      try {
        const response = await client.send(command);
        const email = response.UserAttributes?.find(
          (attr) => attr.Name === 'email',
        )?.Value;
        const name =
          response.UserAttributes?.find((attr) => attr.Name === 'name')
            ?.Value || email;
        if (!email || !name) {
          throw new InvalidTokenException();
        }
        user = await this.userService.findOrCreateByExternalId(sub, email);
      } catch (error) {
        console.log(error);
        throw new InvalidTokenException();
      }
    }
    if (!user) {
      throw new InvalidTokenException();
    }

    return {
      userId: user.id,
      sub: payload.sub,
      iss: payload.iss,
    };
  }
}
