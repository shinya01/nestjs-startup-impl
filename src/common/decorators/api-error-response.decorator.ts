import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '../swagger';

export function ApiErrorResponses() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: '業務エラー',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'リソースなし',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: 'システムエラー',
      type: ErrorResponseDto,
    }),
  );
}
