import { ScraperEnum } from '../enums/scraper.enum';

export class ScrapResultDto {
  public html: string;

  public duration: number;

  public statusCode: number;

  public scrapedBy: ScraperEnum;
}
