import { DomainTypeEnum } from '../enums/domain-type.enum';
import { YamlSchemaEntity } from '../../yaml-schemas/entities/yaml-schema.entity';

export class DomainEntity {
  public id: number;

  public domain: string;

  public url: string;

  public logo: string;

  public rating: number;

  public type: DomainTypeEnum;

  public yamlSchema: YamlSchemaEntity;

  public createdAt: Date;

  public updatedAt: Date;

  public deletedAt: Date;

  constructor(domain: string, url: string, logo: string, rating: number, type: DomainTypeEnum) {
    this.domain = domain;
    this.url = url;
    this.logo = logo;
    this.rating = rating;
    this.type = type;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
