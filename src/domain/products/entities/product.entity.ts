import { ProductPriceEntity } from './product-price.entity';
import { ProductColorEntity } from './product-color.entity';
import { ProductSizeEntity } from './product-size.entity';

export class ProductEntity {
  public id: number;

  public title: string;

  public url: string;

  public prices: ProductPriceEntity[];

  public availability: boolean;

  public colors: ProductColorEntity[];

  public sizes: ProductSizeEntity[];

  public image: string;

  public ean: string;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(
    title: string,
    url: string,
    prices: ProductPriceEntity[],
    availability: boolean,
    colors: ProductColorEntity[],
    sizes: ProductSizeEntity[],
    image: string,
    ean: string,
  ) {
    this.title = title;
    this.url = url;
    this.prices = prices;
    this.availability = availability;
    this.colors = colors;
    this.sizes = sizes;
    this.image = image;
    this.ean = ean;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
