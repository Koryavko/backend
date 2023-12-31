import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  validateOrReject,
  ValidationError,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { CURRENCIES_ISO_4217 } from '../data/valid-currency-codes';
import { DomainException } from '../exceptions/domain.exception';

export class ParseResultVo {
  @IsNotEmpty()
  @IsString()
  @Expose()
  public title: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @Max(999999)
  @Expose()
  public price: number;

  @IsOptional()
  @IsString()
  @Expose()
  public ean: string;

  @IsOptional()
  @IsString()
  @IsIn(CURRENCIES_ISO_4217, { message: 'currency must be in ISO 4217' })
  @Expose()
  public currency: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @Expose()
  public image: string;

  @IsOptional()
  @IsString()
  @Expose()
  public brand: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  public priceOld: number;

  @IsOptional()
  @IsBoolean()
  @Expose()
  public availability: boolean;

  @IsOptional()
  @IsString()
  @Expose()
  public description: string;

  @IsOptional()
  @IsString()
  @Expose()
  public rating: string;

  constructor(
    title: string,
    price: string,
    currency: string,
    image: string,
    brand: string,
    priceOld: string,
    availability: string,
    description: string,
    rating: string,
    ean: string,
  ) {
    this.title = this.transformTitle(title);
    this.price = this.transformPrice(price);
    this.currency = this.transformCurrency(currency);
    this.image = this.transformImage(image);
    this.brand = brand;
    this.priceOld = this.transformPrice(priceOld);
    this.availability = this.transformAvailability(availability);
    this.description = description;
    this.rating = rating;
    this.ean = this.transformEAN(ean);
  }

  private transformTitle(title: string): string {
    if (!title) {
      return null;
    }

    return title;
  }

  private transformCurrency(currency: string): string {
    if (!currency) {
      return 'EUR'; // Default
    }

    return currency;
  }

  private transformEAN(ean: string): string | null {
    if (typeof ean !== 'string' || !ean.length) {
      return null;
    }

    const trimValue = ean.trim();
    const EANValue = trimValue.match(/\d{13,14}/);
    if (!EANValue || !EANValue.length) {
      return null;
    }

    return EANValue[0];
  }

  private transformImage(image: string): string {
    if (!image) {
      return null;
    }

    if (image.includes('http://') || image.includes('https://')) {
      return encodeURI(image);
    }

    return null;
  }

  private transformPrice(price: string): number {
    if (!price) {
      return null;
    }

    return Number(
      price
        .replace(',', '.')
        .replace(/(\d)€(\d)/g, '$1.$2')
        .replace(/(\d)&euro;(\d)/g, '$1.$2')
        .replace(/[^\d.]/g, '')
        .replace(/\.$/g, ''),
    );
  }

  private transformAvailability(availability: string): boolean {
    if (!availability) {
      return true;
    }

    const transformed = availability.toLowerCase().replace('_', '');

    return (
      [
        'terminé',
        'épuisé',
        "m'alerter",
        'indisponible',
        'rupturedestock',
        'bientôt',
        'aviserdisponibilité',
        'outofstock',
        'oos',
        'vendu',
        'soldout',
        'unavailable',
        'notinstock',
        'comingsoon',
        'leproduitque',
      ].includes(transformed) === false
    );
  }

  public async validate(): Promise<boolean> {
    try {
      await validateOrReject(this);

      return true;
    } catch (e) {
      if (Array.isArray(e) && e.every((item) => item instanceof ValidationError)) {
        const mapped = e.map((err: ValidationError) => err.constraints);

        throw new DomainException(`Failed validation of the result object. Errors: ${JSON.stringify(mapped)}`);
      }

      throw e;
    }
  }
}
