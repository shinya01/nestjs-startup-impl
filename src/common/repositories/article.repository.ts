import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities';

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(Article)
    private readonly repo: Repository<Article>,
  ) {}

  findAll(): Promise<Article[]> {
    return this.repo.find({ relations: ['author'] });
  }

  findById(id: number): Promise<Article | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  save(article: Partial<Article>): Promise<Article> {
    return this.repo.save(article);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
