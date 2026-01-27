import { UserRepository } from './user.repository';
import { UserInfoRepository } from './user-info.repository';
import { ArticleRepository } from './article.repository';

export const REPOSITORIES = [
  UserRepository,
  UserInfoRepository,
  ArticleRepository,
];

export * from './user.repository';
export * from './user-info.repository';
export * from './article.repository';
