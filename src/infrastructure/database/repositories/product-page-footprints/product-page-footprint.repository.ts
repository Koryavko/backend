import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
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

  public async deleteAllUnSynced(): Promise<void> {
    await this.delete({ isSynced: false });
  }
}
