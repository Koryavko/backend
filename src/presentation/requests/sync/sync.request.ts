import { ListNameEnum } from '../../../domain/sync-sheets/enums/list-name.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SyncRequest {
  @IsEnum(ListNameEnum)
  @IsNotEmpty()
  @ApiProperty({
    enum: ListNameEnum,
    example: ListNameEnum.PRODUCT_PAGE_FOOTPRINTS,
    type: String,
    nullable: false,
    required: true,
  })
  public list: ListNameEnum;
}
