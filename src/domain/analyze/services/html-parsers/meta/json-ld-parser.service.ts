import { ParseResultVo } from '../../../vo/parse-result.vo';
import { Injectable, Logger } from '@nestjs/common';
import { HtmlVo } from '../vo/html.vo';
import { CssSelectorDto } from '../dto/css-selector.dto';
import { Brand, Offer, PriceSpecification, Product } from 'schema-dts';
import { HtmlParserEnum } from '../../../enums/html-parser.enum';
import { HtmlParserInterface } from '../../../interfaces/html-parser.interface';

@Injectable()
export class JsonLdParserService implements HtmlParserInterface {
  private readonly logger = new Logger(JsonLdParserService.name);

  public async parseHtml(html: string): Promise<ParseResultVo> {
    const htmlVo = new HtmlVo(html);

    const product: Product = this.findProductSchema(htmlVo);
    const offer: Offer = this.getOffer(product);

    return new ParseResultVo(
      product?.name ? String(product.name) : null,
      this.getPrice(offer),
      this.getCurrency(offer),
      this.getImage(product),
      this.getBrand(product),
      null,
      this.getStock(offer),
      product?.description ? String(product.description) : null,
      null,
      null,
    );
  }

  private findProductSchema(htmlVo: HtmlVo): Product {
    const rawSchemas = htmlVo.extractAllBySelector(new CssSelectorDto('script[type=application/ld+json]', null));
    if (rawSchemas.length === 0) {
      return null;
    }

    let productSchema = null;

    for (const rawSchema of rawSchemas) {
      try {
        const object = JSON.parse(rawSchema);
        if (String(object['@type']).toLowerCase() === 'product') {
          productSchema = object;
        }
      } catch (e) {
        this.logger.error(`Unable to parse JSON-LD schema ${rawSchema}`);
      }
    }

    return productSchema;
  }

  private getBrand(product: Product): string {
    if (!product?.brand) {
      return null;
    }

    if (typeof product.brand === 'string') {
      return String(product.brand);
    }

    const brand = <Brand>product.brand;

    return String(brand.name);
  }

  private getImage(product: Product): string {
    if (!product?.image) {
      return null;
    }

    if (Array.isArray(product.image)) {
      return product.image[0];
    }

    return String(product.image);
  }

  private getOffer(product: Product): Offer {
    if (!product?.offers) {
      return null;
    }

    if (Array.isArray(product.offers)) {
      return product.offers[0];
    }

    return <Offer>product.offers;
  }

  private getStock(offer: Offer): string {
    if (!offer) {
      return 'InStock';
    }

    if (offer.availability !== 'https://schema.org/InStock') {
      return null;
    }

    return 'InStock';
  }

  private getPrice(offer: Offer): string {
    if (offer?.price) {
      return String(offer.price);
    }

    if (offer?.priceSpecification) {
      const priceSpecification = <PriceSpecification>offer.priceSpecification;

      return String(priceSpecification.price);
    }

    return null;
  }

  private getCurrency(offer: Offer): string {
    if (offer?.priceCurrency) {
      return String(offer.priceCurrency);
    }

    if (offer?.priceSpecification) {
      const priceSpecification = <PriceSpecification>offer.priceSpecification;

      return String(priceSpecification.priceCurrency);
    }

    return null;
  }

  public getName(): HtmlParserEnum {
    return HtmlParserEnum.META_JSON_LD;
  }
}
