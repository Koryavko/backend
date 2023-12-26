import { EntitySchema } from 'typeorm';
import { BaseMapper } from '../base.mapper';
import { DomainImportantQueryParamsEntity } from '../../../../domain/domains/entities/domain-important-query-params.entity';
import { DomainQueryParamTypeEnum } from '../../../../domain/products/enums/domain-query-param-type.enum';

export const DomainImportantQueryParamMapper = new EntitySchema<DomainImportantQueryParamsEntity>({
  name: 'DomainImportantQueryParamsEntity',
  tableName: 'domain_important_query_params',
  target: DomainImportantQueryParamsEntity,
  columns: {
    ...BaseMapper,
    domainName: {
      name: 'domain_name',
      type: String,
      length: 255,
      nullable: false,
    },
    param: {
      name: 'param',
      type: String,
      nullable: false,
    },
    type: {
      type: 'enum',
      enum: DomainQueryParamTypeEnum,
      nullable: false,
    },
    isSynced: {
      name: 'is_synced',
      type: Boolean,
      default: true,
      nullable: false,
    },
  },
  orderBy: {
    id: 'ASC',
  },
  relations: {
    domain: {
      type: 'many-to-one',
      target: 'DomainEntity',
      joinColumn: {
        name: 'domain_id',
      },
    },
  },
});
