import { DomainEntity } from '../../domains/entities/domain.entity';

export class ProductPageFootprintEntity {
  public id: number;

  public domainName: string;

  public domain: DomainEntity;

  public footprint: string;

  public isSynced: boolean;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(domainName: string, domain: DomainEntity, footprint: string, isSynced: boolean) {
    this.domain = domain;
    this.domainName = domainName;
    this.footprint = footprint;
    this.isSynced = isSynced;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
