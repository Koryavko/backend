import { ProductEntity } from './product.entity';

export class ProductPriceEntity {
  public id: number;

  public price: number;

  public product: ProductEntity;

  public currency: string;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(price: number, currency: string, product?: ProductEntity) {
    this.price = price ?? 0;
    this.product = product;
    this.currency = currency;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
