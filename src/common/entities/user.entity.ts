import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Article } from './article.entity';
import { UserInfo } from './user-info.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  externalId: string;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToOne(() => UserInfo, (info) => info.user, {
    eager: true,
  })
  info?: UserInfo;
}
