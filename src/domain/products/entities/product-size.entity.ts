import { ProductEntity } from './product.entity';

export class ProductSizeEntity {
  public id: number;

  public size: string;

  public product: ProductEntity;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(size: string, product: ProductEntity) {
    this.size = size;
    this.product = product;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
