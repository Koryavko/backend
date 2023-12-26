import { ProductEntity } from './product.entity';

export class ProductSizeEntity {
  public id: number;

  public size: string;

  public product: ProductEntity;

  public available: boolean;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(size: string, product: ProductEntity, available: boolean) {
    this.size = size;
    this.product = product;
    this.available = available;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
