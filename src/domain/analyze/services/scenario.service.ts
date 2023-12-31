import { Injectable } from '@nestjs/common';
import { DomainStatEntity } from '../../domains/entities/domain-stat.entity';
import { DirectApiEnum } from '../enums/direct-api.enum';
import { DirectApiInterface } from '../interfaces/direct-api-interface';
import { DirectApiFactory } from '../factories/direct-api.factory';
import { ScraperEnum } from '../enums/scraper.enum';
import { ScraperInterface } from '../interfaces/scraper.interface';
import { ScraperFactory } from '../factories/scraper.factory';
import { HtmlParserEnum } from '../enums/html-parser.enum';
import { HtmlParserInterface } from '../interfaces/html-parser.interface';
import { HtmlParserFactory } from '../factories/html-parser.factory';
import { ScrapResultDto } from '../dto/scrap-result.dto';
import { ParseResultVo } from '../vo/parse-result.vo';
import { ParseResultHelper } from '../helpers/parse-result.helper';
import { NotEnoughProductDataException } from '../exceptions/not-enough-product-data.exception';

@Injectable()
export class ScenarioService {
  constructor(
    private readonly directApiFactory: DirectApiFactory,
    private readonly scraperFactory: ScraperFactory,
    private readonly htmlParserFactory: HtmlParserFactory,
  ) {}

  public async shouldStartWithDirectApiCall(domainStat: DomainStatEntity): Promise<boolean> {
    if (!domainStat) {
      return false;
    }

    return Object.values(DirectApiEnum).includes(<DirectApiEnum>domainStat.preferredParser);
  }

  private getDefaultDirectApi(): DirectApiInterface[] {
    return [
      this.directApiFactory.getDirectApi(DirectApiEnum.DIFFBOT),
      this.directApiFactory.getDirectApi(DirectApiEnum.SHOPIFY),
      this.directApiFactory.getDirectApi(DirectApiEnum.FNAC),
    ];
  }

  public async defineDirectApis(domainStatEntity?: DomainStatEntity): Promise<DirectApiInterface[]> {
    const defaultDirectApis = this.getDefaultDirectApi();
    if (!Object.values(DirectApiEnum).includes(<DirectApiEnum>domainStatEntity?.preferredParser)) {
      return defaultDirectApis;
    }

    const preferredApi = <DirectApiEnum>domainStatEntity?.preferredParser;
    if (!preferredApi) {
      return defaultDirectApis;
    }

    const preferredDirectApiInstance = this.directApiFactory.getDirectApi(preferredApi);
    const priorityList = [preferredDirectApiInstance];
    const filterPriorityList = defaultDirectApis.filter(
      (defaultHtmlParser) => defaultHtmlParser.getName() !== preferredDirectApiInstance.getName(),
    );

    return priorityList.concat(filterPriorityList);
  }

  public async defineScrapers(domainStatEntity?: DomainStatEntity): Promise<ScraperInterface[]> {
    const defaultScrapers = this.getDefaultScrapers();

    const preferredScraper = <ScraperEnum>domainStatEntity?.preferredScraper;
    if (!preferredScraper) {
      return defaultScrapers;
    }

    const preferredScraperInstance = this.scraperFactory.getScraper(preferredScraper);
    const priorityList = [preferredScraperInstance];

    defaultScrapers.forEach((defaultScraper) => {
      if (defaultScraper.getName() !== preferredScraperInstance.getName()) {
        priorityList.push(defaultScraper);
      }
    });

    return priorityList;
  }

  private getDefaultScrapers(): ScraperInterface[] {
    return [
      this.scraperFactory.getScraper(ScraperEnum.SCRAPERAPI),
      this.scraperFactory.getScraper(ScraperEnum.SCRAPFLY),
    ];
  }

  private getDefaultHtmlParsers(): HtmlParserInterface[] {
    return [
      this.htmlParserFactory.getHtmlParser(HtmlParserEnum.SELECTOR),
      this.htmlParserFactory.getHtmlParser(HtmlParserEnum.META_OG),
      this.htmlParserFactory.getHtmlParser(HtmlParserEnum.META_JSON_LD),
    ];
  }

  public async defineHtmlParsers(domainStatEntity?: DomainStatEntity): Promise<HtmlParserInterface[]> {
    const defaultHtmlParsers = this.getDefaultHtmlParsers();

    if (!Object.values(HtmlParserEnum).includes(<HtmlParserEnum>domainStatEntity?.preferredParser)) {
      return defaultHtmlParsers;
    }

    const preferredParser: HtmlParserEnum = <HtmlParserEnum>domainStatEntity?.preferredParser;
    if (!preferredParser) {
      return defaultHtmlParsers;
    }

    const preferredHtmlParserInstance = this.htmlParserFactory.getHtmlParser(preferredParser);
    const priorityList = [preferredHtmlParserInstance];

    defaultHtmlParsers.forEach((defaultHtmlParser) => {
      if (defaultHtmlParser.getName() !== preferredHtmlParserInstance.getName()) {
        priorityList.push(defaultHtmlParser);
      }
    });

    return priorityList;
  }

  public async defineFallbackScrapers(
    domainStatEntity: DomainStatEntity,
    scrapResultDto?: ScrapResultDto,
  ): Promise<ScraperInterface[]> {
    const defaultScrapers = await this.defineScrapers(domainStatEntity);
    const fallbackScrapers = [];

    let shouldPush = false;
    for (const scraper of defaultScrapers) {
      if (shouldPush) {
        fallbackScrapers.push(scraper);
      }

      shouldPush = scraper.getName() === scrapResultDto?.scrapedBy;
    }

    return fallbackScrapers;
  }

  public async collectData(candidates: ParseResultVo[]): Promise<ParseResultVo> {
    let collected = null;
    try {
      collected = ParseResultHelper.merge(candidates);
      await collected.validate();

      return collected;
    } catch (e) {
      throw new NotEnoughProductDataException(`Not enough product data after the collection method`, collected);
    }
  }
}
