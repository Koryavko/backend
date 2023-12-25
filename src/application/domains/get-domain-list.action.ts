import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetDomainListResponse } from '../../presentation/responses/domains/get-domain-list.response';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DOMAIN_LIST_WITH_SCHEMAS } from '../../infrastructure/constants/redis.constant';

@Injectable()
export class GetDomainListAction {
  private readonly logger = new Logger(GetDomainListAction.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheService: Cache) {}

  public async execute(): Promise<GetDomainListResponse> {
    try {
      const domains = await this.cacheService.get<string[]>(DOMAIN_LIST_WITH_SCHEMAS);

      return new GetDomainListResponse(domains ?? []);
    } catch (e) {
      this.logger.error(`Error while getting domain list: ${e.message}`, e.stack);

      return new GetDomainListResponse([]);
    }
  }
}
