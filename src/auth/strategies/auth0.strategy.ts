// src/auth/strategies/auth0.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategyBase } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import type { SecretOrKeyProvider } from 'passport-jwt';
import { InvalidTokenException } from '../exceptions';
import { AuthUser } from '../types';
import { UserDto } from '../../user/dto';
import { UserService } from '../../user/user.service';

// Auth0のアクセストークンのClaimインターフェース
interface Claim {
  sub: string;
  iss: string;
  aud: string[];
  scope: string;
  exp: number;
  iat: number;
  gty: string;
  azp: string;
}

@Injectable()
export class Auth0Strategy extends PassportStrategy(JwtStrategyBase, 'auth0') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const jwksUri = configService.get<string>('jwt.jwksUri') || '';
    const issuer = configService.get<string>('jwt.issuer') || '';
    const audience = configService.get<string>('jwt.audience') ?? '';
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
      audience,
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
    if (!sub) {
      throw new InvalidTokenException();
    }

    // ユーザ情報同期(登録)処理
    let user: UserDto | null = null;
    try {
      user = await this.userService.findByExternalId(sub);
    } catch {
      /* empty */
    }

    // TODO: メールアドレスをIdPから取得してDBに登録する処理

    // ユーザーが見つからない場合は例外をスロー
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
