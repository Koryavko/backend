import { Inject, Injectable, Logger } from '@nestjs/common';
import { FetchYamlsService } from '../../../infrastructure/external/modules/gcp/fetch-yamls.service';
import { YamlSchemaRepository } from '../../../infrastructure/database/repositories/yaml-schemas/yaml-schema.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DOMAIN_LIST_WITH_SCHEMAS } from '../../../infrastructure/constants/redis.constant';

@Injectable()
export class YamlUpdateService {
  private readonly logger = new Logger(YamlUpdateService.name);

  private readonly ttl = 1000 * 60 * 60 * (24 * 3); // 72h;

  constructor(
    private readonly fetchYamlsService: FetchYamlsService,
    private readonly yamlSchemaRepository: YamlSchemaRepository,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  public async sync(): Promise<void> {
    const entities = await this.fetchYamlsService.prepareEntities();
    const domains: string[] = [];

    for (const entity of entities) {
      await this.yamlSchemaRepository.updateByDomainOrCreate(entity).catch((e) => {
        this.logger.error(`Unable to update yaml schema for domain ${entity.domainName}. ${e.message}`, e.stack);
      });
      domains.push(entity.domainName);
    }

    await this.cacheService.set(DOMAIN_LIST_WITH_SCHEMAS, domains, this.ttl);
  }
}
