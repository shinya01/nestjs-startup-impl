import { Controller, Get, Post, Param, Body, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserDto } from './dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {
    this.logger.log('UserController initialized');
  }

  @Get()
  @ApiOperation({ summary: '全ユーザーを取得' })
  @ApiResponse({ status: 200, type: [UserDto] })
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'IDでユーザーを取得' })
  @ApiParam({ name: 'id', description: 'ユーザーID' })
  @ApiResponse({ status: 200, type: UserDto })
  getById(@Param('id') id: string) {
    return this.userService.getById(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'ユーザーを作成' })
  @ApiResponse({ status: 201, type: UserDto })
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }
}
