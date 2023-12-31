import { Injectable, Logger } from '@nestjs/common';
import { ProductFavoriteEntity } from '../../products/entities/product-favorite.entity';
import { URLHelper } from '../../utillity/helpers/url.helper';
import { DomainStatRepository } from '../../../infrastructure/database/repositories/domains/domain-stat.repository';
import { YamlSchemaRepository } from '../../../infrastructure/database/repositories/yaml-schemas/yaml-schema.repository';
import { ScenarioService } from './scenario.service';
import { DomainStatEntity } from '../../domains/entities/domain-stat.entity';
import { YamlSchemaEntity } from '../../yaml-schemas/entities/yaml-schema.entity';
import { ParseResultVo } from '../vo/parse-result.vo';
import { NotEnoughProductDataException } from '../exceptions/not-enough-product-data.exception';
import { ExternalApiException } from '../../../infrastructure/exceptions/external-api.exception';
import { ScenarioRunnerService } from './scenario-runner.service';

@Injectable()
export class CheckProductService {
  private readonly logger = new Logger(CheckProductService.name);

  constructor(
    private readonly domainStatRepository: DomainStatRepository,
    private readonly yamlSchemaRepository: YamlSchemaRepository,
    private readonly scenarioService: ScenarioService,
    private readonly scenarioRunnerService: ScenarioRunnerService,
  ) {}

  private async runWithApiFirst(
    url: string,
    domain: string,
    domainStatEntity: DomainStatEntity,
    candidates: ParseResultVo[],
  ): Promise<ParseResultVo[] | any> {
    try {
      return await this.scenarioRunnerService.runDirectApiParsers(
        url,
        domain,
        await this.scenarioService.defineDirectApis(domainStatEntity),
      );
    } catch (e) {
      if (e instanceof NotEnoughProductDataException) {
        candidates.push(e.data);
      }

      this.logger.error(`Direct API scenarios failed as the first step. ${e.message}`, e.stack);
    }
  }

  private async runWithHtmlFirst(
    url: string,
    domain: string,
    domainStatEntity: DomainStatEntity,
    yamlSchemaEntity: YamlSchemaEntity,
    candidates: ParseResultVo[],
  ): Promise<ParseResultVo[] | any> {
    try {
      return await this.scenarioRunnerService.runNoHtmlScenarioWithFallback(
        url,
        domain,
        domainStatEntity,
        yamlSchemaEntity,
      );
    } catch (e) {
      if (e instanceof ExternalApiException) {
        this.logger.error(`External API failed as the second step. ${e.message}`, e.stack);

        return;
      }

      if (e instanceof NotEnoughProductDataException) {
        candidates.push(e.data);
      }

      this.logger.error(`No-HTML failed as the second step. ${e.message}`, e.stack);
    }
  }

  public async checkProduct(favorite: ProductFavoriteEntity): Promise<ParseResultVo> {
    const domain = URLHelper.extractDomain(favorite.product.url);

    const [domainStatEntity, yamlSchemaEntity] = await Promise.all([
      this.domainStatRepository.findStatsForDomain(domain),
      this.yamlSchemaRepository.findByDomain(domain),
    ]);

    const shouldStartWithDirectApis = await this.scenarioService.shouldStartWithDirectApiCall(domainStatEntity);
    const candidates = <ParseResultVo[]>[];

    if (shouldStartWithDirectApis) {
      await this.runWithApiFirst(favorite.product.url, domain, domainStatEntity, candidates);
    }

    await this.runWithHtmlFirst(favorite.product.url, domain, domainStatEntity, yamlSchemaEntity, candidates);

    if (!shouldStartWithDirectApis) {
      await this.runWithApiFirst(favorite.product.url, domain, domainStatEntity, candidates);
    }

    return this.scenarioService.collectData(candidates);
  }
}
