import { ScrapResultDto } from '../../../../../domain/analyze/dto/scrap-result.dto';
import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SCRAPFLY_API_URL } from './constants';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ScrapflyViewModel } from './view-models/scrapfly.view-model';
import { BackOffPolicy, Retryable } from 'typescript-retry-decorator';
import { AxiosError } from 'axios';
import { ScraperEnum } from '../../../../../domain/analyze/enums/scraper.enum';
import { ExternalApiException } from '../../../../exceptions/external-api.exception';
import { ScraperInterface } from '../../../../../domain/analyze/interfaces/scraper.interface';

@Injectable()
export class ScrapflyApiService implements ScraperInterface {
  private readonly logger = new Logger(ScrapflyApiService.name);

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

  public async scrapByUrl(url: string): Promise<ScrapResultDto> {
    const scrapResultDto = new ScrapResultDto();

    try {
      const scrapflyViewModel = await this.sendRequest(url);

      scrapResultDto.html = scrapflyViewModel.content;
      scrapResultDto.duration = scrapflyViewModel.duration;
      scrapResultDto.statusCode = HttpStatus.OK;
      scrapResultDto.scrapedBy = ScraperEnum.SCRAPFLY;

      return scrapResultDto;
    } catch (e) {
      throw new ExternalApiException(`Unable to scrap HTML via the Scrapfly API. ${e.message}`, e?.response?.status);
    }
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
  private async sendRequest(url: string): Promise<ScrapflyViewModel> {
    this.logger.log(`Attempting to scrap HTML of the ${url} page via the scrapfly API...`);

    const result = await firstValueFrom(
      this.httpService.get(SCRAPFLY_API_URL, {
        params: {
          key: this.configService.get('SCRAPFLY_API_KEY'),
          country: 'fr',
          url,
          proxy_pool: 'public_residential_pool',
          asp: true,
          render_js: true,
        },
      }),
    );

    return ScrapflyViewModel.createFromRawApiResponse(result);
  }

  public getName(): ScraperEnum {
    return ScraperEnum.SCRAPFLY;
  }
}
