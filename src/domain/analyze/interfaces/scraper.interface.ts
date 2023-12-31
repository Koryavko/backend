import { ScraperEnum } from '../enums/scraper.enum';
import { ScrapResultDto } from '../dto/scrap-result.dto';

export interface ScraperInterface {
  scrapByUrl(url: string): Promise<ScrapResultDto>;

  getName(): ScraperEnum;
}
