import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductPageFootprintEntity } from '../../../../domain/product-page-footprints/entities/product-page-footprint.entity';
import { ProductPageFootprintMapper } from '../../mappers/product-page-footprints/product-page-footprint.mapper';

@Injectable()
export class ProductPageFootprintRepository extends Repository<ProductPageFootprintEntity> {
  constructor(
    @InjectRepository(ProductPageFootprintMapper)
    repository: Repository<ProductPageFootprintEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async setAllUnSynced(): Promise<void> {
    await this.update({ isSynced: true }, { isSynced: false });
  }

  public async createProductPageFootprint(footprintEntity: ProductPageFootprintEntity): Promise<void> {
    await this.insert(footprintEntity);
  }

  public async findByUnSynced(): Promise<ProductPageFootprintEntity[]> {
    return this.findBy({ isSynced: false });
  }

  public async getCountByIsSynced(): Promise<number> {
    return this.countBy({ isSynced: true });
  }

  public async findByDomain(domain: string): Promise<ProductPageFootprintEntity[]> {
    return this.findBy({ domainName: domain });
  }

  public async findUniqueFootprints(): Promise<ProductPageFootprintEntity[]> {
    return this.findBy({ domainName: IsNull() });
  }
}
