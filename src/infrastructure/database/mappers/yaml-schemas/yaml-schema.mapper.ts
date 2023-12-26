import { EntitySchema } from 'typeorm';
import { BaseMapper } from '../base.mapper';
import { YamlSchemaEntity } from '../../../../domain/yaml-schemas/entities/yaml-schema.entity';

export const YamlSchemaMapper = new EntitySchema<YamlSchemaEntity>({
  name: 'YamlSchemaEntity',
  tableName: 'yaml_schemas',
  target: YamlSchemaEntity,
  columns: {
    ...BaseMapper,
    domainName: {
      type: String,
      nullable: false,
      name: 'domain_name',
    },
    title: {
      type: 'jsonb',
      nullable: false,
    },
    image: {
      type: 'jsonb',
      nullable: false,
    },
    price: {
      type: 'jsonb',
      nullable: false,
    },
    color: {
      type: 'jsonb',
      nullable: true,
    },
    availability: {
      type: 'jsonb',
      nullable: false,
    },
    currency: {
      type: 'jsonb',
      nullable: true,
    },
    ean: {
      type: 'jsonb',
      nullable: true,
    },
    size: {
      type: 'jsonb',
      nullable: true,
    },
    defaultCurrency: {
      type: String,
      nullable: false,
      name: 'default_currency',
    },
  },
  orderBy: {
    id: 'ASC',
  },
  relations: {
    domain: {
      type: 'one-to-one',
      target: 'DomainEntity',
      inverseSide: 'yamlSchema',
      joinColumn: {
        name: 'domain_id',
      },
    },
  },
});
