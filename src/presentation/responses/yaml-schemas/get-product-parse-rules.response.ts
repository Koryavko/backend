import { ApiProperty } from '@nestjs/swagger';
import { SelectorInterface } from '../../../domain/yaml-schemas/interfaces/selector.interface';
import { SelectorTypeEnum } from '../../../domain/yaml-schemas/enums/selector-type.enum';

class CssXpathSelector {
  @ApiProperty({
    type: String,
    nullable: false,
    example: 'div.slick-slide:nth-of-type(1) img',
  })
  public selector: string;

  @ApiProperty({
    type: SelectorTypeEnum,
    enum: SelectorTypeEnum,
    nullable: false,
    example: SelectorTypeEnum.CSS,
  })
  public type: SelectorTypeEnum;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'src',
  })
  public attribute: string;
}

export class SelectorsResponse {
  @ApiProperty({
    nullable: false,
    type: [CssXpathSelector],
    example: [
      {
        type: 'xpath',
        selector: "//meta[contains(@name, 'page-type')]",
        attribute: 'data-page-name',
      },
      {
        type: 'css',
        selector: 'title',
        attribute: null,
      },
      {
        type: 'css',
        selector: 'h1.HcIFde',
        attribute: null,
      },
    ],
  })
  public title: SelectorInterface[];

  @ApiProperty({
    nullable: false,
    type: [CssXpathSelector],
    example: [
      {
        type: 'xpath',
        selector: "//meta[contains(@property, 'og:image')]",
        attribute: 'content',
      },
    ],
  })
  public image: SelectorInterface[];

  @ApiProperty({
    nullable: false,
    type: [CssXpathSelector],
    example: [
      {
        type: 'xpath',
        selector: "//div[contains(@data-testid, 'main-price-container')]",
        attribute: null,
      },
      {
        type: 'css',
        selector: 'div.info-price__wrapper div.prices__price.prices__main-price__price',
        attribute: null,
      },
    ],
  })
  public price: SelectorInterface[];

  @ApiProperty({
    nullable: true,
    type: [CssXpathSelector],
    isArray: true,
    example: [
      {
        type: 'xpath',
        selector: "//div[contains(@data-testid, 'main-price-container')]",
        attribute: null,
      },
      {
        type: 'css',
        selector: 'div.info-price__wrapper div.prices__price.prices__main-price__price',
        attribute: null,
      },
    ],
  })
  public color: SelectorInterface[];

  @ApiProperty({
    nullable: true,
    type: [CssXpathSelector],
    isArray: true,
    example: [
      {
        type: 'xpath',
        selector: "//span[contains(@itemprop, 'priceCurrency')]",
        attribute: 'content',
      },
    ],
  })
  public currency: SelectorInterface[];

  @ApiProperty({
    nullable: false,
    type: [CssXpathSelector],
    isArray: true,
    example: [
      {
        type: 'xpath',
        selector: "//span[contains(@itemprop, 'priceCurrency')]",
        attribute: 'content',
      },
    ],
  })
  public availability: SelectorInterface[];

  @ApiProperty({
    nullable: true,
    type: [CssXpathSelector],
    isArray: true,
    example: [
      {
        type: 'xpath',
        selector: "//span[contains(@itemprop, 'priceCurrency')]",
        attribute: 'content',
      },
    ],
  })
  public size: SelectorInterface[];

  @ApiProperty({
    nullable: false,
    type: String,
    example: 'EUR',
  })
  public defaultCurrency: string;

  constructor(
    title: SelectorInterface[],
    image: SelectorInterface[],
    price: SelectorInterface[],
    size: SelectorInterface[],
    color: SelectorInterface[],
    currency: SelectorInterface[],
    availability: SelectorInterface[],
    defaultCurrency: string,
  ) {
    this.title = title;
    this.image = image;
    this.price = price;
    this.size = size;
    this.color = color;
    this.currency = currency;
    this.availability = availability;
    this.defaultCurrency = defaultCurrency;
  }
}

export class GetProductParseRulesResponse {
  @ApiProperty({ type: SelectorsResponse, nullable: true, example: SelectorsResponse })
  public selectors: SelectorsResponse;

  constructor(selectors: SelectorsResponse) {
    this.selectors = selectors;
  }
}
