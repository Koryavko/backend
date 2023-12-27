import { Injectable, Logger } from '@nestjs/common';
import { URLHelper } from '../../utillity/helpers/url.helper';
import { DomainQueryParamTypeEnum } from '../enums/domain-query-param-type.enum';
import { DomainImportantQueryParamRepository } from '../../../infrastructure/database/repositories/domains/domain-important-query-param.repository';
import { DomainImportantQueryParamsEntity } from '../../domains/entities/domain-important-query-params.entity';

@Injectable()
export class ProductUrlService {
  private readonly logger = new Logger(ProductUrlService.name);

  constructor(private readonly domainImportantQueryParamRepository: DomainImportantQueryParamRepository) {}

  private isParamImportant(importantQueryParams: DomainImportantQueryParamsEntity[], param: string): boolean {
    for (const importantQueryParam of importantQueryParams) {
      if (importantQueryParam.type === DomainQueryParamTypeEnum.RAW && param === importantQueryParam.param) {
        return true;
      }

      if (importantQueryParam.type === DomainQueryParamTypeEnum.REGEXP) {
        const regex = new RegExp(importantQueryParam.param, 'ig');

        if (regex.test(param)) {
          return true;
        }
      }
    }

    return false;
  }

  private isHashImportant(domainImportantQueryParam: DomainImportantQueryParamsEntity, hash: string): boolean {
    let isImportant = false;

    if (domainImportantQueryParam.type === DomainQueryParamTypeEnum.RAW && hash === domainImportantQueryParam.param) {
      isImportant = true;
    }

    if (domainImportantQueryParam.type === DomainQueryParamTypeEnum.REGEXP) {
      const regex = new RegExp(domainImportantQueryParam.param, 'ig');
      if (regex.test(hash)) {
        isImportant = true;
      }
    }

    return isImportant;
  }

  private checkHasParam(
    importantQueryParams: DomainImportantQueryParamsEntity[],
    urlObject: URL,
    searchParamsReplacement: URLSearchParams,
  ): boolean {
    for (const [key, value] of urlObject.searchParams.entries()) {
      const isParamImportant = this.isParamImportant(importantQueryParams, key);

      if (isParamImportant) {
        searchParamsReplacement.set(key, value);

        return true;
      }
    }

    return false;
  }

  private getHash(urlObject: URL, importantQueryParams: DomainImportantQueryParamsEntity[]): string {
    for (const importantQueryParam of importantQueryParams) {
      if (
        urlObject.hash.includes(`#${importantQueryParam.param}=`) ||
        this.isHashImportant(importantQueryParam, urlObject.hash)
      ) {
        return urlObject.hash;
      }
    }

    return '';
  }

  public async transformUrl(url: string): Promise<string> {
    try {
      const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
      const urlObject = new URL(urlWithProtocol);
      urlObject.protocol = 'https';

      const domain = URLHelper.extractDomain(urlObject.toString());
      const importantQueryParams = await this.domainImportantQueryParamRepository.findByDomainName(domain);
      if (!importantQueryParams) {
        return `${urlObject.protocol}//${urlObject.hostname}${urlObject.pathname}`;
      }

      const searchParamsReplacement = new URLSearchParams();
      const hasParams = this.checkHasParam(importantQueryParams, urlObject, searchParamsReplacement);
      const hash = this.getHash(urlObject, importantQueryParams);
      const queryString = hasParams ? `?${searchParamsReplacement.toString()}` : '';

      return `${urlObject.protocol}//${urlObject.hostname}${urlObject.pathname}${queryString}${hash}`.trim();
    } catch (e) {
      this.logger.error(`Error when transforming url. Message: ${e.message}`, e.stack);

      throw e;
    }
  }
}
