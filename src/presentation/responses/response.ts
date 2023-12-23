import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

class ErrorResponse {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  public code: number;

  @ApiProperty({ example: '13:51:52 GMT+0000 (Coordinated Universal Time)' })
  public timestamp: string;

  @ApiProperty({ example: 'method/path' })
  public path: string;

  @ApiProperty({ example: 'POST' })
  public method: string;

  @ApiProperty({ example: 'Bad Request Exception' })
  public message: string | string[];

  @ApiProperty({ example: 'check-url' })
  public service: string;

  @ApiProperty({ nullable: true, required: false })
  public details: any | null;
}

export class AuthErrorResponse extends ErrorResponse {
  @ApiProperty({ example: HttpStatus.UNAUTHORIZED })
  public code: number;

  @ApiProperty({ example: 'Unauthorized' })
  public message: string;
}

export class ForbiddenErrorResponse extends ErrorResponse {
  @ApiProperty({ example: HttpStatus.FORBIDDEN })
  public code: number;

  @ApiProperty({ example: 'Forbidden Resource' })
  public message: string;
}

export class NotFoundResponse extends ErrorResponse {
  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  public code: number;

  @ApiProperty({ example: 'Conflict error' })
  public message: string;
}

export class ConflictErrorResponse extends ErrorResponse {
  @ApiProperty({ example: HttpStatus.CONFLICT })
  public code: number;

  @ApiProperty({ example: 'Conflict error' })
  public message: string;
}

export class UnprocessableErrorResponse extends ErrorResponse {
  @ApiProperty({ example: HttpStatus.UNPROCESSABLE_ENTITY })
  public code: number;

  @ApiProperty({ example: ['Error validation', 'Description of errors'] })
  public message: string[];
}

export class ServiceUnavailableResponse extends ErrorResponse {
  @ApiProperty({ example: HttpStatus.SERVICE_UNAVAILABLE })
  public code: number;

  @ApiProperty({ example: 'Third party api error' })
  public message: string;
}
