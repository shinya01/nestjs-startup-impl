import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto, ArticleDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponses } from '../common/decorators';

@ApiTags('Articles')
@Controller('articles')
@ApiErrorResponses()
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);

  constructor(private readonly articleService: ArticleService) {
    this.logger.log('ArticleController initialized');
  }

  @Get()
  @ApiOperation({ summary: '全記事を取得' })
  @ApiResponse({ status: 200, type: [ArticleDto] })
  getAll() {
    return this.articleService.getAll();
  }

  @Post()
  @ApiOperation({ summary: '記事を作成' })
  @ApiResponse({ status: 201, type: ArticleDto })
  create(@Body() body: CreateArticleDto) {
    return this.articleService.create(body);
  }
}
