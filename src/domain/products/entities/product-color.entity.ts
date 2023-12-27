import { ProductEntity } from './product.entity';

export class ProductColorEntity {
  public id: number;

  public color: string;

  public product: ProductEntity;

  public availability: boolean;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(color: string, availability: boolean, product?: ProductEntity) {
    this.color = color;
    this.product = product;
    this.availability = availability;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
