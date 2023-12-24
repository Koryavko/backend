import { DomainTypeEnum } from '../enums/domain-type.enum';
import { YamlSchemaEntity } from '../../yaml-schemas/entities/yaml-schema.entity';

export class DomainEntity {
  public id: number;

  public domain: string;

  public page: string;

  public logo: string;

  public rating: number;

  public type: DomainTypeEnum;

  public yamlSchema: YamlSchemaEntity;

  public createdAt: Date;

  public updatedAt: Date;

  public deletedAt: Date;

  constructor(domain: string, page: string, logo: string, rating: number, type: DomainTypeEnum) {
    this.domain = domain;
    this.page = page;
    this.logo = logo;
    this.rating = rating;
    this.type = type;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
