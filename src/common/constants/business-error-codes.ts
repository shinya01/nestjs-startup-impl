export const BusinessErrorCodes = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  NOT_FOUND: 'NOT_FOUND',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_REQUIRED: 'EMAIL_REQUIRED',
} as const;

export type BusinessErrorCode =
  (typeof BusinessErrorCodes)[keyof typeof BusinessErrorCodes];
