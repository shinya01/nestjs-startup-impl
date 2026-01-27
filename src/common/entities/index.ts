import { User } from './user.entity';
import { Article } from './article.entity';
import { UserInfo } from './user-info.entity';

export const ENTITIES = [User, Article, UserInfo];
export * from './user.entity';
export * from './user-info.entity';
export * from './article.entity';
