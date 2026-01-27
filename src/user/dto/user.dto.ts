import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class UserInfoDto {
  @ApiProperty()
  @Expose()
  name: string;
}

export class UserDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty({ type: () => UserInfoDto, nullable: true })
  @Expose()
  @Type(() => UserInfoDto)
  info?: UserInfoDto | null;
}
