import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ArticleRepository, UserRepository } from '../common/repositories';
import { ArticleDto, CreateArticleDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    private readonly articleRepo: ArticleRepository,
    private readonly userRepo: UserRepository,
  ) {
    this.logger.log('ArticleService initialized');
  }

  async getAll(): Promise<ArticleDto[]> {
    const articles = await this.articleRepo.findAll();
    return plainToInstance(ArticleDto, articles, {
      excludeExtraneousValues: true,
    });
  }

  @Transactional()
  async create(data: CreateArticleDto): Promise<ArticleDto> {
    const author = await this.userRepo.findById(data.authorId);
    if (!author) throw new NotFoundException('Author not found');

    const article = await this.articleRepo.save({
      title: data.title,
      content: data.content,
      author,
    });
    return plainToInstance(ArticleDto, article, {
      excludeExtraneousValues: true,
    });
  }
}
