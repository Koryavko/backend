import { Inject, Injectable, Logger } from '@nestjs/common';
import { SyncSheetInterface } from '../interfaces/sync-sheet.interface';
import { ProductPageFootprintRepository } from '../../../infrastructure/database/repositories/product-page-footprints/product-page-footprint.repository';
import { ProductPageFootprintDto } from '../../product-page-footprints/dto/product-page-footprint.dto';
import { ProductPageFootprintEntity } from '../../product-page-footprints/entities/product-page-footprint.entity';
import { DomainRepository } from '../../../infrastructure/database/repositories/domains/domain.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  PRODUCT_PAGE_FOOTPRINT_DOMAIN,
  PRODUCT_PAGE_FOOTPRINT_UNIQUE,
} from '../../../infrastructure/constants/redis.constant';

@Injectable()
export class SyncProductPageFootprintsService implements SyncSheetInterface {
  private readonly logger = new Logger(SyncProductPageFootprintsService.name);

  constructor(
    private readonly productPageFootprintRepository: ProductPageFootprintRepository,
    private readonly domainRepository: DomainRepository,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  private async deleteAllUnSynced(): Promise<void> {
    const unSynced = await this.productPageFootprintRepository.findByUnSynced();

    for (const productPageFootprintEntity of unSynced) {
      await Promise.all([
        this.cacheService.del(PRODUCT_PAGE_FOOTPRINT_DOMAIN + productPageFootprintEntity.domainName),
        this.productPageFootprintRepository.remove(productPageFootprintEntity),
      ]);
    }
  }

  private async saveProductPageFootprints(data: string[][]): Promise<void> {
    for (let i = 0; i < data.length; i++) {
      const [domain, footprint] = data[i];
      if (!footprint || !footprint.length) {
        continue;
      }

      const productPageFootprintDto = new ProductPageFootprintDto(domain, footprint, i);
      const validationResponse = await productPageFootprintDto.validate();
      if (validationResponse.error) {
        continue;
      }

      let domainEntity;
      try {
        if (domain) {
          domainEntity = await this.domainRepository.findOneByDomain(domain);
        }

        const productPageFootprintEntity = new ProductPageFootprintEntity(domain, domainEntity, footprint, true);
        await this.productPageFootprintRepository.createProductPageFootprint(productPageFootprintEntity);
      } catch (e) {
        this.logger.error(`Error while saving product page footprint: ${e.message}`, e.stack);
      }
    }
  }

  public async sync(data: string[][]): Promise<number> {
    await this.productPageFootprintRepository.setAllUnSynced();
    await this.saveProductPageFootprints(data);

    const [countByIsSynced] = await Promise.all([
      this.productPageFootprintRepository.getCountByIsSynced(),
      this.deleteAllUnSynced(),
      this.cacheService.del(PRODUCT_PAGE_FOOTPRINT_UNIQUE),
    ]);

    return countByIsSynced;
  }
}
