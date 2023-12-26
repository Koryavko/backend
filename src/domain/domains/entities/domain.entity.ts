import { DomainTypeEnum } from '../enums/domain-type.enum';
import { YamlSchemaEntity } from '../../yaml-schemas/entities/yaml-schema.entity';
import { ProductPageFootprintEntity } from '../../product-page-footprints/entities/product-page-footprint.entity';
import { DomainImportantQueryParamsEntity } from './domain-important-query-params.entity';

export class DomainEntity {
  public id: number;

  public domain: string;

  public url: string;

  public logo: string;

  public rating: number;

  public type: DomainTypeEnum;

  public yamlSchema: YamlSchemaEntity;

  public productFootprints: ProductPageFootprintEntity[];

  public domainImportantQueryParams: DomainImportantQueryParamsEntity[];

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
