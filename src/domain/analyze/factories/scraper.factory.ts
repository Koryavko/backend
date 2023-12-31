import { ScraperEnum } from '../enums/scraper.enum';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ScraperInterface } from '../interfaces/scraper.interface';
import { ScrapflyApiService } from '../../../infrastructure/external/modules/scrapers/scrapfly-api/scrapfly-api.service';
import { ScraperApiService } from '../../../infrastructure/external/modules/scrapers/scraper-api/scraper-api.service';

@Injectable()
export class ScraperFactory {
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

  public getScraper(scraper: ScraperEnum): ScraperInterface {
    switch (scraper) {
      case ScraperEnum.SCRAPERAPI:
        return new ScraperApiService(this.httpService, this.configService);
      case ScraperEnum.SCRAPFLY:
        return new ScrapflyApiService(this.httpService, this.configService);
      default:
        throw new Error(`Failed to create instance for ${scraper} scraper`);
    }
  }
}
