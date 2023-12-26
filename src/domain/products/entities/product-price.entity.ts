import { ProductEntity } from './product.entity';

export class ProductPriceEntity {
  public id: number;

  public price: number;

  public product: ProductEntity;

  public available: boolean;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(price: number, product: ProductEntity, available: boolean) {
    this.price = price;
    this.product = product;
    this.available = available;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
