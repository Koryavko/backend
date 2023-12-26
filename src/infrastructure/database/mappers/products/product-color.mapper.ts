import { EntitySchema } from 'typeorm';
import { BaseMapper } from '../base.mapper';
import { ProductColorEntity } from '../../../../domain/products/entities/product-color.entity';

export const ProductColorMapper = new EntitySchema<ProductColorEntity>({
  name: 'ProductColorEntity',
  tableName: 'product_colors',
  target: ProductColorEntity,
  columns: {
    ...BaseMapper,
    color: {
      name: 'color',
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
