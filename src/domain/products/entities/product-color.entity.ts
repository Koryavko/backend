import { ProductEntity } from './product.entity';

export class ProductColorEntity {
  public id: number;

  public color: string;

  public product: ProductEntity;

  public available: boolean;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(color: string, product: ProductEntity, available: boolean) {
    this.color = color;
    this.product = product;
    this.available = available;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
