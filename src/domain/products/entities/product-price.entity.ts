import { ProductEntity } from './product.entity';

export class ProductPriceEntity {
  public id: number;

  public price: number;

  public product: ProductEntity;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(price: number, product: ProductEntity) {
    this.price = price;
    this.product = product;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
