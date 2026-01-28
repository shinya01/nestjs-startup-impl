import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategyBase } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import type { SecretOrKeyProvider } from 'passport-jwt';
import { InvalidTokenException } from '../exceptions';
import { AuthUser } from '../types';

interface Claim {
  sub: string;
  iss: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
}

@Injectable()
export class Auth0Strategy extends PassportStrategy(JwtStrategyBase, 'auth0') {
  constructor(private readonly configService: ConfigService) {
    const jwksUri = configService.get<string>('jwt.jwksUri') || '';
    const issuer = configService.get<string>('jwt.issuer') || '';
    const audience = configService.get<string>('jwt.audience') || '';

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

  validate(req: Request, payload: Claim): AuthUser {
    if (!payload.sub) {
      throw new InvalidTokenException();
    }

    return {
      sub: payload.sub,
      iss: payload.iss,
    };
  }
}
