import { BrowserEnum } from '../../../domain/users/enums/browser.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InstallExtensionRequest {
  @IsEnum(BrowserEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: BrowserEnum, type: String, required: true, nullable: false, example: BrowserEnum.CHROME })
  public browser: BrowserEnum;
}
