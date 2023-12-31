import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { BackOffPolicy, Retryable } from 'typescript-retry-decorator';
import { AxiosError } from 'axios';
import { ParseResultVo } from '../../../../../domain/analyze/vo/parse-result.vo';
import { ShopifyViewModel } from './view-models/shopify.view-model';
import { ExternalApiException } from '../../../../exceptions/external-api.exception';
import { DirectApiEnum } from '../../../../../domain/analyze/enums/direct-api.enum';
import { DirectApiInterface } from '../../../../../domain/analyze/interfaces/direct-api-interface';

@Injectable()
export class ShopifyApiService implements DirectApiInterface {
  private readonly logger = new Logger(ShopifyApiService.name);

  constructor(private readonly httpService: HttpService) {}

  public async getDataByUrl(url: string): Promise<ParseResultVo> {
    let diffbotViewModel = new ShopifyViewModel();

    try {
      diffbotViewModel = await this.sendRequest(url);
    } catch (e) {
      throw new ExternalApiException(`Unable to scrap HTML via the Shopify API. ${e.message}`, e?.response?.status);
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
    maxAttempts: 0,
    backOffPolicy: BackOffPolicy.ExponentialBackOffPolicy,
    backOff: 1000,
    exponentialOption: { maxInterval: 4000, multiplier: 3 },
    doRetry: (e: AxiosError) => {
      return (e?.response?.status && ![404, 410, 400].includes(e.response.status)) || e.code === 'ECONNABORTED';
    },
    useOriginalError: true,
  })
  private async sendRequest(url: string): Promise<ShopifyViewModel> {
    this.logger.log(`Attempting to get the product data from the url ${url} via the shopify data...`);

    const updatedUrl = this.appendJsonToTheUrl(url);

    const result = await firstValueFrom(this.httpService.get(updatedUrl));

    return ShopifyViewModel.createFromRawApiResponse(result);
  }

  public appendJsonToTheUrl(url: string): string {
    const urlObject = new URL(url);

    urlObject.pathname = `${urlObject.pathname}/products.json`;

    return urlObject.toString();
  }

  public getName(): DirectApiEnum {
    return DirectApiEnum.SHOPIFY;
  }
}
