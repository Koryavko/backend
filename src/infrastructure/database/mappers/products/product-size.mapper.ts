import { EntitySchema } from 'typeorm';
import { BaseMapper } from '../base.mapper';
import { ProductSizeEntity } from '../../../../domain/products/entities/product-size.entity';

export const ProductSizeMapper = new EntitySchema<ProductSizeEntity>({
  name: 'ProductSizeEntity',
  tableName: 'product_sizes',
  target: ProductSizeEntity,
  columns: {
    ...BaseMapper,
    size: {
      name: 'size',
      type: String,
      nullable: false,
    },
    available: {
      name: 'available',
      type: Boolean,
      default: true,
      nullable: false,
    },
  },
  orderBy: {
    id: 'ASC',
  },
  relations: {
    product: {
      type: 'many-to-one',
      target: 'ProductEntity',
      joinColumn: {
        name: 'product_id',
      },
    },
  },
});
