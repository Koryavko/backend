import { EntitySchema } from 'typeorm';
import { BaseMapper } from '../base.mapper';
import { DomainEntity } from '../../../../domain/domains/entities/domain.entity';
import { DomainTypeEnum } from '../../../../domain/domains/enums/domain-type.enum';

export const DomainMapper = new EntitySchema<DomainEntity>({
  name: 'DomainEntity',
  tableName: 'domains',
  target: DomainEntity,
  columns: {
    ...BaseMapper,
    domain: {
      name: 'domain',
      type: String,
      length: 255,
      nullable: false,
    },
    url: {
      name: 'url',
      type: String,
      length: 2048,
      nullable: false,
    },
    logo: {
      name: 'logo',
      type: String,
      length: 2048,
      nullable: false,
    },
    rating: {
      type: Number,
      default: 0,
      name: 'rating',
      nullable: false,
    },
    type: {
      type: 'enum',
      enum: DomainTypeEnum,
      default: DomainTypeEnum.WORLD,
      nullable: false,
    },
  },
  orderBy: {
    id: 'ASC',
  },
  relations: {
    yamlSchema: {
      type: 'one-to-one',
      target: 'YamlSchemaEntity',
      inverseSide: 'domain',
    },
  },
});
