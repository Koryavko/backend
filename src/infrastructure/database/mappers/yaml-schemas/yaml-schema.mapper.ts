import { EntitySchema } from 'typeorm';
import { BaseMapper } from '../base.mapper';
import { YamlSchemaEntity } from '../../../../domain/yaml-schemas/entities/yaml-schema.entity';

export const YamlSchemaMapper = new EntitySchema<YamlSchemaEntity>({
  name: 'YamlSchemaEntity',
  tableName: 'yaml-schemas',
  target: YamlSchemaEntity,
  columns: {
    ...BaseMapper,
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
      nullable: false,
    },
    availability: {
      type: 'jsonb',
      nullable: false,
    },
    currency: {
      type: 'jsonb',
      nullable: false,
    },
    size: {
      type: 'jsonb',
      nullable: false,
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
      cascade: true,
    },
  },
});
