import { ScrapResultDto } from '../../../../../domain/analyze/dto/scrap-result.dto';
import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SCRAPER_API_URL } from './constants';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { BackOffPolicy, Retryable } from 'typescript-retry-decorator';
import { AxiosError } from 'axios';
import { ScraperViewModel } from './view-models/scraper.view-model';
import { ScraperEnum } from '../../../../../domain/analyze/enums/scraper.enum';
import { ExternalApiException } from '../../../../exceptions/external-api.exception';
import { ScraperInterface } from '../../../../../domain/analyze/interfaces/scraper.interface';

@Injectable()
export class ScraperApiService implements ScraperInterface {
  private readonly logger = new Logger(ScraperApiService.name);

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

  public async scrapByUrl(url: string): Promise<ScrapResultDto> {
    const scrapResultDto = new ScrapResultDto();

    try {
      const scraperViewModel = await this.sendRequest(url);

      scrapResultDto.html = scraperViewModel.content;
      scrapResultDto.duration = scraperViewModel.duration;
      scrapResultDto.statusCode = HttpStatus.OK;
      scrapResultDto.scrapedBy = ScraperEnum.SCRAPERAPI;

      return scrapResultDto;
    } catch (e) {
      throw new ExternalApiException(`Unable to scrap HTML via the ScraperAPI. ${e.message}`, e?.response?.status);
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
  private async sendRequest(url: string): Promise<ScraperViewModel> {
    this.logger.log(`Attempting to scrap HTML of the ${url} page via the scraper API...`);

    const result = await firstValueFrom(
      this.httpService.get(SCRAPER_API_URL, {
        params: {
          api_key: this.configService.get('SCRAPER_API_KEY'),
          country_code: 'fr',
          url,
          device_type: 'desktop',
          scraper_sdk: 'python',
        },
      }),
    );

    return new ScraperViewModel(result?.data, 0);
  }

  public getName(): ScraperEnum {
    return ScraperEnum.SCRAPERAPI;
  }
}
