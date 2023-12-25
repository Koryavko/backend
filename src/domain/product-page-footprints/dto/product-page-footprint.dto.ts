import { IsNotEmpty, IsOptional, IsString, IsUrl, validateOrReject } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsRegex } from '../../../infrastructure/decorators/is-regexp.decorator';

export class ProductPageFootprintDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  public domain: string;

  @IsString()
  @IsNotEmpty()
  @IsRegex()
  @Transform((item) => String(item).trim())
  public footprint: string;

  public index: number;

  constructor(domain: string, footprint: string, index: number) {
    this.domain = domain;
    this.footprint = footprint;
    this.index = index;
  }

  public async validate(): Promise<{ error: null | string }> {
    try {
      await validateOrReject(this);

      return { error: null };
    } catch (errors) {
      return { error: this.prepareErrorMessages(this) };
    }
  }

  private prepareErrorMessages(dto: ProductPageFootprintDto): string {
    if (dto.domain && dto.footprint) {
      return `Invalid ${dto.domain} with ${dto.footprint} at line ${this.index}`;
    }

    return null;
  }
}
