import { Injectable, Logger } from '@nestjs/common';
import { URLHelper } from '../../domain/utillity/helpers/url.helper';
import { YamlSchemaRepository } from '../../infrastructure/database/repositories/yaml-schemas/yaml-schema.repository';
import { GetProductParseRulesResponse } from '../../presentation/responses/yaml-schemas/get-product-parse-rules.response';
import { YamlSchemaService } from '../../domain/yaml-schemas/services/yaml-schema.service';

@Injectable()
export class GetProductParseRulesAction {
  private readonly logger = new Logger(GetProductParseRulesAction.name);

  constructor(
    private readonly yamlSchemaRepository: YamlSchemaRepository,
    private readonly yamlSchemaService: YamlSchemaService,
  ) {}

  public async execute(domain: string): Promise<GetProductParseRulesResponse> {
    try {
      domain = URLHelper.extractDomain(domain);

      const yamlSchemaEntity = await this.yamlSchemaRepository.findByDomain(domain);
      if (!yamlSchemaEntity) {
        return new GetProductParseRulesResponse(null);
      }

      return new GetProductParseRulesResponse(this.yamlSchemaService.extractSelectors(yamlSchemaEntity));
    } catch (e) {
      this.logger.error(`Error in receiving selectors. Message: ${e.message}`, e.stack);

      return new GetProductParseRulesResponse(null);
    }
  }
}
