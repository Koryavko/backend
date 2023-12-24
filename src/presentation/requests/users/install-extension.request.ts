import { BrowserEnum } from '../../../domain/users/enums/browser.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlatformEnum } from '../../../domain/users/enums/platform.enum';

export class InstallExtensionRequest {
  @IsEnum(BrowserEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: BrowserEnum, type: String, required: true, nullable: false, example: BrowserEnum.CHROME })
  public browser: BrowserEnum;

  @IsEnum(PlatformEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: PlatformEnum, type: String, required: true, nullable: false, example: PlatformEnum.EXTENSION })
  public platform: PlatformEnum;
}
