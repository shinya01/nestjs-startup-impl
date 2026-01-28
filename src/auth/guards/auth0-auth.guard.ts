import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthUser } from '../types';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class Auth0AuthGuard extends AuthGuard('auth0') {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // クラス(Controller)またはメソッド(Handler)に@Public()があるかチェック
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 公開ルートの場合は認証をパス、それ以外は通常のJWT検証を実行
    return isPublic ? true : super.canActivate(context);
  }

  handleRequest<TUser = AuthUser>(err: any, user: TUser, info: any): TUser {
    const disableAuth = this.configService.get<boolean>('app.authDisable');
    if (disableAuth) {
      return { userId: 1, sub: 'dummy-user', iss: 'dummy' } as TUser;
    }

    if (err || !user) {
      // info が Error インスタンスかどうか、またはメッセージを持っているか確認
      let errorMessage = 'Authentication failed';
      if (info instanceof Error) {
        errorMessage = info.message;
      } else if (
        typeof info === 'object' &&
        info !== null &&
        'message' in info
      ) {
        errorMessage = String((info as { message: unknown }).message);
      } else if (typeof info === 'string') {
        errorMessage = info;
      }
      throw err instanceof Error
        ? err
        : new UnauthorizedException(errorMessage);
    }
    return user;
  }
}
