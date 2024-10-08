import { EntitySchema } from 'typeorm';
import { BaseMapper } from '../base.mapper';
import { ProductEntity } from '../../../../domain/products/entities/product.entity';

export const ProductMapper = new EntitySchema<ProductEntity>({
  name: 'ProductEntity',
  tableName: 'products',
  target: ProductEntity,
  columns: {
    ...BaseMapper,
    url: {
      name: 'url',
      type: String,
      length: 2048,
      nullable: false,
    },
    title: {
      name: 'title',
      type: String,
      nullable: true,
    },
    image: {
      name: 'image',
      type: String,
      nullable: true,
    },
    availability: {
      name: 'availability',
      type: Boolean,
      nullable: false,
      default: false,
    },
    ean: {
      name: 'ean',
      type: String,
      nullable: true,
    },
  },
  orderBy: {
    id: 'ASC',
  },
  relations: {
    prices: {
      type: 'one-to-many',
      onDelete: 'CASCADE',
      cascade: true,
      target: 'ProductPriceEntity',
      inverseSide: 'product',
    },
    sizes: {
      type: 'one-to-many',
      onDelete: 'CASCADE',
      cascade: true,
      target: 'ProductSizeEntity',
      inverseSide: 'product',
    },
    colors: {
      type: 'one-to-many',
      onDelete: 'CASCADE',
      cascade: true,
      target: 'ProductColorEntity',
      inverseSide: 'product',
    },
    domain: {
      type: 'many-to-one',
      target: 'DomainEntity',
      joinColumn: {
        name: 'domain_id',
      },
    },
  },
});
