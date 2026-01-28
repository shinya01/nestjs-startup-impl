export interface AuthUser {
  userId: number; // アプリDB上のユーザーID
  sub: string; // 外部IdP上の識別子
  iss: string;
}
