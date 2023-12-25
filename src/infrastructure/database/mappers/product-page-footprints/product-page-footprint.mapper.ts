import { EntitySchema } from 'typeorm';
import { BaseMapper } from '../base.mapper';
import { ProductPageFootprintEntity } from '../../../../domain/product-page-footprints/entities/product-page-footprint.entity';

export const ProductPageFootprintMapper = new EntitySchema<ProductPageFootprintEntity>({
  name: 'ProductPageFootprintEntity',
  tableName: 'product_page_footprints',
  target: ProductPageFootprintEntity,
  columns: {
    ...BaseMapper,
    domainName: {
      type: String,
      length: 255,
      name: 'domain_name',
      nullable: true,
    },
    footprint: {
      name: 'footprint',
      type: String,
      nullable: false,
    },
    isSynced: {
      name: 'is_synced',
      type: Boolean,
      nullable: false,
      default: true,
    },
  },
  orderBy: {
    id: 'ASC',
  },
  relations: {
    domain: {
      type: 'many-to-one',
      target: 'DomainEntity',
      nullable: true,
      joinColumn: {
        name: 'domain_id',
      },
    },
  },
});
