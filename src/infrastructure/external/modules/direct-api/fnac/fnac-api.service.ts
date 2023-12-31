import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { FNAC_API_URL } from './constants';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { BackOffPolicy, Retryable } from 'typescript-retry-decorator';
import { AxiosError } from 'axios';
import { ParseResultVo } from '../../../../../domain/analyze/vo/parse-result.vo';
import { FnacViewModel } from './view-models/fnac.view-model';
import { ExternalApiException } from '../../../../exceptions/external-api.exception';
import { InfrastructureException } from '../../../../exceptions/infrastructure.exception';
import { DirectApiInterface } from '../../../../../domain/analyze/interfaces/direct-api-interface';
import { DirectApiEnum } from '../../../../../domain/analyze/enums/direct-api.enum';

@Injectable()
export class FnacApiService implements DirectApiInterface {
  private readonly logger = new Logger(FnacApiService.name);

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

  public async getDataByUrl(url: string): Promise<ParseResultVo> {
    let fnacViewModel = new FnacViewModel();

    try {
      fnacViewModel = await this.sendRequest(url);
    } catch (e) {
      throw new ExternalApiException(
        `Unable to parse the product data via the Fnac API. ${e.message}`,
        e?.response?.status,
      );
    }

    return new ParseResultVo(
      fnacViewModel.title,
      fnacViewModel.price,
      fnacViewModel.currency,
      fnacViewModel.image,
      fnacViewModel.brand,
      null,
      fnacViewModel.availability,
      fnacViewModel.description,
      null,
      null,
    );
  }

  @Retryable({
    maxAttempts: 1,
    backOffPolicy: BackOffPolicy.ExponentialBackOffPolicy,
    backOff: 1000,
    exponentialOption: { maxInterval: 4000, multiplier: 3 },
    doRetry: (e: AxiosError) => {
      return (e?.response?.status && ![404, 410, 400].includes(e.response.status)) || e.code === 'ECONNABORTED';
    },
    useOriginalError: true,
  })
  private async sendRequest(url: string): Promise<FnacViewModel> {
    this.logger.log(`Attempting to get the product data from the ${url} page via the Fnac API...`);

    const articleId = this.extractArticleIdFromUrl(url);
    const result = await firstValueFrom(
      this.httpService.get(FNAC_API_URL, {
        params: {
          all: true,
          siteCode: this.configService.get('FNAC_SITE_CODE'),
          eans: `["${articleId}"]`,
        },
      }),
    );

    return FnacViewModel.createFromRawApiResponse(result);
  }

  public extractArticleIdFromUrl(url: string): string {
    const match = url.match(/([/a]|[/mp])+\d+[/]/g);
    if (match === null) {
      throw new InfrastructureException(`Unable to extract the Fnac product id from the url ${url}`);
    }

    return match[0].replace(/[\/a]|[\/]|[\/mp]/g, '');
  }

  public getName(): DirectApiEnum {
    return DirectApiEnum.FNAC;
  }
}
