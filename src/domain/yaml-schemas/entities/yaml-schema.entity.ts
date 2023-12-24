import { DomainEntity } from '../../domains/entities/domain.entity';

export class YamlSchemaEntity {
  public id: number;

  public domain: DomainEntity;

  public title: Record<string, unknown>;

  public image: Record<string, unknown>;

  public price: Record<string, unknown>;

  public color: Record<string, unknown>;

  public availability: Record<string, unknown>;

  public currency: Record<string, unknown>;

  public size: Record<string, unknown>;

  public createdAt: Date;

  public updatedAt: Date;

  public deletedAt: Date;

  constructor(
    domain: DomainEntity,
    title: Record<string, unknown>,
    image: Record<string, unknown>,
    price: Record<string, unknown>,
    color: Record<string, unknown>,
    availability: Record<string, unknown>,
    size: Record<string, unknown>,
    currency: Record<string, unknown>,
  ) {
    this.domain = domain;
    this.title = title;
    this.image = image;
    this.price = price;
    this.color = color;
    this.availability = availability;
    this.size = size;
    this.currency = currency;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.deletedAt = null;
  }
}
