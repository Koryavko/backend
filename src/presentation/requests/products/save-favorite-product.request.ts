import { IsEnum, IsNotEmpty, IsString, Min, MinLength, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationFeatureEnum } from '../../../domain/products/enums/notification-feature.enum';
import { ProductParseRequest } from './product-parse.request';

export class SaveFavoriteProductRequest extends ProductParseRequest {
  @IsEnum(NotificationFeatureEnum)
  @IsNotEmpty()
  @ApiProperty({
    example: NotificationFeatureEnum.AVAILABILITY,
    type: 'enum',
    enum: NotificationFeatureEnum,
    required: true,
    nullable: false,
    description: 'Feature to notify about',
  })
  public feature: NotificationFeatureEnum = NotificationFeatureEnum.AVAILABILITY;

  @ValidateIf((o) => o.feature === NotificationFeatureEnum.SIZE)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value && String(value)?.trim())
  @ApiProperty({
    example: 'XL',
    type: String,
    required: true,
    nullable: false,
    description: 'Size to be reported in feature cases = size',
  })
  @MinLength(1)
  public notifySize: string;

  @ValidateIf((o) => o.feature === NotificationFeatureEnum.COLOR)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value && String(value)?.trim())
  @ApiProperty({
    example: 'red',
    type: String,
    required: true,
    nullable: false,
    description: 'Size to be reported in feature cases = color',
  })
  @MinLength(1)
  public notifyColor: string;

  @ValidateIf((o) => o.feature === NotificationFeatureEnum.PRICE)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value && Number(value))
  @ApiProperty({
    example: 10,
    type: Number,
    required: true,
    nullable: false,
    description: 'Price percentage threshold. Feature = price',
  })
  @Min(1)
  public notifyPrice: number;
}
