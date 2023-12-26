import { EntitySchema } from 'typeorm';
import { BaseMapper } from '../base.mapper';
import { ProductPriceEntity } from '../../../../domain/products/entities/product-price.entity';

export const ProductPriceMapper = new EntitySchema<ProductPriceEntity>({
  name: 'ProductPriceEntity',
  tableName: 'product_prices',
  target: ProductPriceEntity,
  columns: {
    ...BaseMapper,
    price: {
      name: 'price',
      type: Number,
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
