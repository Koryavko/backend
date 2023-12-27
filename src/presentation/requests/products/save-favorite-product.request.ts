import {
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEAN,
  IsEnum,
  IsInt,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationFeatureEnum } from '../../../domain/products/enums/notification-feature.enum';

class SizeRequest {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value && String(value)?.trim())
  @ApiProperty({ example: 'XL', type: String, required: true, nullable: false })
  @MinLength(1)
  public size: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true, type: Boolean, required: true, nullable: false })
  public availability: boolean;
}

class ColorRequest {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value && String(value)?.trim())
  @ApiProperty({ example: 'red', type: String, required: true, nullable: false })
  @MinLength(1)
  public color: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true, type: Boolean, required: true, nullable: false })
  public availability: boolean;
}

export class SaveFavoriteProductRequest {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value && String(value)?.trim())
  @MinLength(1)
  @ApiProperty({ example: 'Product title', type: String, required: true, nullable: false })
  public title: string;

  @IsNotEmpty()
  @IsUrl({ require_protocol: true })
  @Transform(({ value }: { value: string }) => value && String(value)?.trim())
  @ApiProperty({
    example: 'https://www.amazon.de/-/en/MPUF3ZD-A/dp/B0BDJH7J5C/',
    type: String,
    required: true,
    nullable: false,
  })
  public url: string;

  @IsString()
  @IsISO4217CurrencyCode()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value && String(value)?.trim())
  @MinLength(3)
  @ApiProperty({ example: 'EUR', type: String, required: false, nullable: true })
  public currency: string = null;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true, type: Boolean, required: true, nullable: false })
  public availability = false;

  @IsNotEmpty()
  @IsUrl({ require_protocol: true })
  @Transform(({ value }: { value: string }) => value && String(value)?.trim())
  @ApiProperty({
    example: 'https://www.amazon.de/-/en/MPUF3ZD-A/dp/B0BDJH7J5C/',
    type: String,
    required: true,
    nullable: false,
  })
  public image: string;

  @IsEAN()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value && String(value)?.trim())
  @ApiProperty({ example: '3617070288732', type: String, required: false, nullable: true })
  public ean: string = null;

  @IsOptional()
  @Transform(({ value }) => value && Number(value))
  @IsInt()
  @ApiProperty({ example: 142, type: Number, required: false, nullable: true })
  public price = 0;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty({ example: ColorRequest, type: ColorRequest, required: false, nullable: true, isArray: true })
  public colors: ColorRequest[] = [];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty({ example: SizeRequest, type: SizeRequest, required: false, nullable: true, isArray: true })
  public sizes: SizeRequest[] = [];

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
}
