import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfo } from '../entities/user-info.entity';

@Injectable()
export class UserInfoRepository {
  constructor(
    @InjectRepository(UserInfo)
    private readonly repo: Repository<UserInfo>,
  ) {}

  findAll(): Promise<UserInfo[]> {
    return this.repo.find({ relations: ['user'] });
  }

  findById(id: number): Promise<UserInfo | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  save(info: Partial<UserInfo>): Promise<UserInfo> {
    return this.repo.save(info);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
