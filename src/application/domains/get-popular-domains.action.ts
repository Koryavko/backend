import { Injectable } from '@nestjs/common';
import {
  GetPopularDomainsResponse,
  PopularDomainInfo,
} from '../../presentation/responses/domains/get-popular-domains.response';
import { DomainTypeEnum } from '../../domain/domains/enums/domain-type.enum';
import { DomainRepository } from '../../infrastructure/database/repositories/domains/domain.repository';

@Injectable()
export class GetPopularDomainsAction {
  constructor(private readonly domainRepository: DomainRepository) {}

  private checkLocaleAndGetType(locale: string): DomainTypeEnum {
    if (!locale) {
      return DomainTypeEnum.WORLD;
    }

    if (locale === 'ru') {
      return DomainTypeEnum.RUSSIAN;
    }

    return DomainTypeEnum.WORLD;
  }

  public async execute(locale: string): Promise<GetPopularDomainsResponse> {
    const type = this.checkLocaleAndGetType(locale);
    const domains = await this.domainRepository.getPopularDomains(type);

    const domainsResponse = domains.map((domain) => {
      return new PopularDomainInfo(domain.domain, domain.rating, domain.page, domain.logo);
    });

    return new GetPopularDomainsResponse(domainsResponse);
  }
}
