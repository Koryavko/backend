import { ProductEntity } from './product.entity';

export class ProductSizeEntity {
  public id: number;

  public size: string;

  public product: ProductEntity;

  public availability: boolean;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(size: string, availability: boolean, product?: ProductEntity) {
    this.size = size;
    this.product = product;
    this.availability = availability;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
