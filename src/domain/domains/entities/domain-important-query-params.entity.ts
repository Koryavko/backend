import { DomainEntity } from './domain.entity';
import { DomainQueryParamTypeEnum } from '../../products/enums/domain-query-param-type.enum';

export class DomainImportantQueryParamsEntity {
  public id: number;

  public domainName: string;

  public domain: DomainEntity;

  public param: string;

  public type: DomainQueryParamTypeEnum;

  public isSynced: boolean;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(
    domainName: string,
    domain: DomainEntity,
    param: string,
    type: DomainQueryParamTypeEnum,
    isSynced: boolean,
  ) {
    this.domainName = domainName;
    this.domain = domain;
    this.param = param;
    this.type = type;
    this.isSynced = isSynced;
  }
}
