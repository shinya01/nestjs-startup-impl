import { Controller, Get, Post, Body, Logger, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto, ArticleDto } from './dto';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiAuthErrorResponses,
  ApiErrorResponses,
  ApiSuccessResponse,
} from '../common/decorators';
import { Auth0AuthGuard } from '../auth/guards';

@ApiTags('Articles')
@Controller('articles')
@ApiErrorResponses()
@ApiBearerAuth('access-token')
@UseGuards(Auth0AuthGuard)
@ApiAuthErrorResponses()
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);

  constructor(private readonly articleService: ArticleService) {
    this.logger.log('ArticleController initialized');
  }

  @Get()
  @ApiOperation({ summary: '全記事を取得' })
  @ApiSuccessResponse({ model: ArticleDto, isArray: true })
  getAll() {
    return this.articleService.getAll();
  }

  @Post()
  @ApiOperation({ summary: '記事を作成' })
  @ApiBody({ type: CreateArticleDto })
  @ApiSuccessResponse({
    model: ArticleDto,
    description: '記事作成成功',
    statusCode: 201,
  })
  create(@Body() body: CreateArticleDto) {
    return this.articleService.create(body);
  }
}
