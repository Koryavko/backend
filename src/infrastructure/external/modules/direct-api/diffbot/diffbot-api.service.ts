import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { DIFFBOT_API_URL } from './constants';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { BackOffPolicy, Retryable } from 'typescript-retry-decorator';
import { AxiosError } from 'axios';
import { ParseResultVo } from '../../../../../domain/analyze/vo/parse-result.vo';
import { DiffbotViewModel } from './view-models/diffbot.view-model';
import { DirectApiInterface } from '../../../../../domain/analyze/interfaces/direct-api-interface';
import { ExternalApiException } from '../../../../exceptions/external-api.exception';
import { DirectApiEnum } from '../../../../../domain/analyze/enums/direct-api.enum';

@Injectable()
export class DiffbotApiService implements DirectApiInterface {
  private readonly logger = new Logger(DiffbotApiService.name);

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    if (!this.configService.get('DIFFBOT_API_KEY')) {
      throw new Error('DIFFBOT_API_KEY is not defined');
    }
  }

  public async getDataByUrl(url: string): Promise<ParseResultVo> {
    let diffbotViewModel = new DiffbotViewModel();

    try {
      diffbotViewModel = await this.sendRequest(url);
    } catch (e) {
      throw new ExternalApiException(
        `Unable to get the product data via the Diffbot API. ${e.message}`,
        e?.response?.status,
      );
    }

    return new ParseResultVo(
      diffbotViewModel.title,
      diffbotViewModel.price,
      diffbotViewModel.currency,
      diffbotViewModel.image,
      diffbotViewModel.brand,
      null,
      diffbotViewModel.availability,
      diffbotViewModel.description,
      null,
      null,
    );
  }

  @Retryable({
    maxAttempts: 2,
    backOffPolicy: BackOffPolicy.ExponentialBackOffPolicy,
    backOff: 1000,
    exponentialOption: { maxInterval: 4000, multiplier: 3 },
    doRetry: (e: AxiosError) => {
      return (e?.response?.status && ![404, 410, 400].includes(e.response.status)) || e.code === 'ECONNABORTED';
    },
    useOriginalError: true,
  })
  private async sendRequest(url: string): Promise<DiffbotViewModel> {
    this.logger.log(`Attempting to get the product data by the ${url} page via the Diffbot API...`);

    const result = await firstValueFrom(
      this.httpService.get(DIFFBOT_API_URL, {
        params: {
          token: this.configService.get('DIFFBOT_API_KEY'),
          url,
        },
      }),
    );

    return DiffbotViewModel.createFromRawApiResponse(result);
  }

  public getName(): DirectApiEnum {
    return DirectApiEnum.DIFFBOT;
  }
}
