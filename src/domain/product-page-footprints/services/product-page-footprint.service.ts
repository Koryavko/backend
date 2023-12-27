import { Inject, Injectable } from '@nestjs/common';
import { ProductPageFootprintRepository } from '../../../infrastructure/database/repositories/product-page-footprints/product-page-footprint.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  PRODUCT_PAGE_FOOTPRINT_DOMAIN,
  PRODUCT_PAGE_FOOTPRINT_UNIQUE,
} from '../../../infrastructure/constants/redis.constant';

@Injectable()
export class ProductPageFootprintService {
  private readonly ttl = 1000 * 60 * 60 * (24 * 14); // 2 weeks

  constructor(
    private readonly productPageFootprintRepository: ProductPageFootprintRepository,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  public async getFootprintsForDomains(domain: string): Promise<string[]> {
    const cacheForDomain = await this.cacheService.get<string>(PRODUCT_PAGE_FOOTPRINT_DOMAIN + domain);
    if (cacheForDomain) {
      return JSON.parse(cacheForDomain);
    }

    const productPageFootprintEntities = await this.productPageFootprintRepository.findByDomain(domain);
    const footprints = productPageFootprintEntities.map((entity) => entity.footprint);
    await this.cacheService.set(PRODUCT_PAGE_FOOTPRINT_DOMAIN + domain, JSON.stringify(footprints), this.ttl);

    return footprints;
  }

  public async getUnusedFootprints(): Promise<string[]> {
    const cacheForDomain = await this.cacheService.get<string>(PRODUCT_PAGE_FOOTPRINT_UNIQUE);
    if (cacheForDomain) {
      return JSON.parse(cacheForDomain);
    }

    const productPageFootprintEntities = await this.productPageFootprintRepository.findUniqueFootprints();
    const footprints = productPageFootprintEntities.map((entity) => entity.footprint);
    await this.cacheService.set(PRODUCT_PAGE_FOOTPRINT_UNIQUE, JSON.stringify(footprints), this.ttl);

    return footprints;
  }
}
