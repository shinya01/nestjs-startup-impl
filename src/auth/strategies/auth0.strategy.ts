// src/auth/strategies/auth0.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategyBase } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import type { SecretOrKeyProvider } from 'passport-jwt';
import { InvalidTokenException } from '../exceptions';
import { AuthUser } from '../types';
import { UserDto } from '../../user/dto';
import { UserService } from '../../user/user.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

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
    private readonly httpService: HttpService,
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
    // UserInfo APIから詳細を取得
    if (!user) {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      const issuer = this.configService.get<string>('jwt.issuer'); // 例: https://xxx.auth0.com/
      try {
        // Auth0の userinfo エンドポイントへリクエスト
        const { data } = await firstValueFrom(
          this.httpService.get<{ email: string }>(`${issuer}userinfo`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        );
        const email = data.email;
        if (!email) throw new UnauthorizedException('Email not found in Auth0');

        // DBに登録/同期
        user = await this.userService.findOrCreateByExternalId(sub, email);
      } catch {
        throw new UnauthorizedException('Failed to fetch user info from Auth0');
      }
    }
    if (!user) {
      throw new UnauthorizedException('Failed to fetch user info from Auth0');
    }

    return {
      userId: user.id,
      sub: payload.sub,
      iss: payload.iss,
    };
  }
}
