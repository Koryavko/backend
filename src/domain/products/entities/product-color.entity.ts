import { ProductEntity } from './product.entity';

export class ProductColorEntity {
  public id: number;

  public color: string;

  public product: ProductEntity;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(color: string, product: ProductEntity) {
    this.color = color;
    this.product = product;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
