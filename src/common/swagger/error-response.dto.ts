import { ApiProperty } from '@nestjs/swagger';
import type { BusinessErrorCode } from '../constants';

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: '2026-01-24T11:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: '/users' })
  path: string;

  @ApiProperty({ example: 'ユーザーが見つかりませんでした' })
  message: string;

  @ApiProperty({ example: 'BusinessException', required: false })
  error?: string;

  @ApiProperty({ example: 'NOT_FOUND', required: false })
  code?: BusinessErrorCode;
}
