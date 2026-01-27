import { Injectable, Logger } from '@nestjs/common';
import { UserRepository, UserInfoRepository } from '../common/repositories';
import { UserDto, CreateUserDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { BusinessException } from '../common/exceptions';
import { BusinessErrorCodes } from '../common/constants';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly userInfoRepo: UserInfoRepository,
  ) {
    this.logger.log('UserService initialized');
  }

  async getAll(): Promise<UserDto[]> {
    const users = await this.userRepo.findAll();
    return plainToInstance(UserDto, users, { excludeExtraneousValues: true });
  }

  async getById(id: number): Promise<UserDto> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new BusinessException(
        BusinessErrorCodes.NOT_FOUND,
        `ユーザー（ID: ${id}）が見つかりませんでした`,
      );
    }
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  @Transactional()
  async create(data: CreateUserDto): Promise<UserDto> {
    const user = await this.userRepo.save({ email: data.email });
    await this.userInfoRepo.save({ name: data.name, user });
    const created = await this.userRepo.findById(user.id);
    return plainToInstance(UserDto, created, { excludeExtraneousValues: true });
  }
}
