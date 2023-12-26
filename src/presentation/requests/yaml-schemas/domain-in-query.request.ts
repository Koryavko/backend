import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class DomainInQueryRequest {
  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
    example: 'amazon.de',
    description: 'Domain name',
    minLength: 3,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  public domain: string;
}
