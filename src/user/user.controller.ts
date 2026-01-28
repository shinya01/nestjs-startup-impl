import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserDto } from './dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  ApiAuthErrorResponses,
  ApiErrorResponses,
  ApiSuccessResponse,
} from '../common/decorators';
import { Auth0AuthGuard } from 'src/auth/guards';

@ApiTags('Users')
@Controller('users')
@ApiErrorResponses()
@ApiBearerAuth('access-token')
@UseGuards(Auth0AuthGuard)
@ApiAuthErrorResponses()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {
    this.logger.log('UserController initialized');
  }

  @Get()
  @ApiOperation({ summary: '全ユーザーを取得' })
  @ApiSuccessResponse({ model: UserDto, isArray: true })
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'IDでユーザーを取得' })
  @ApiParam({ name: 'id', description: 'ユーザーID' })
  @ApiSuccessResponse({ model: UserDto })
  getById(@Param('id') id: string) {
    return this.userService.getById(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'ユーザーを作成' })
  @ApiBody({ type: CreateUserDto })
  @ApiSuccessResponse({
    model: UserDto,
    description: 'ユーザー作成成功',
    statusCode: 201,
  })
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }
}
