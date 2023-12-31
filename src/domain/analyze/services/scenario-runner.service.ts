import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ParseResultVo } from '../vo/parse-result.vo';
import { DirectApiInterface } from '../interfaces/direct-api-interface';
import { NotEnoughProductDataException } from '../exceptions/not-enough-product-data.exception';
import { DomainStatEntity } from '../../domains/entities/domain-stat.entity';
import { YamlSchemaEntity } from '../../yaml-schemas/entities/yaml-schema.entity';
import { ScrapResultDto } from '../dto/scrap-result.dto';
import { ScenarioService } from './scenario.service';
import { ScraperInterface } from '../interfaces/scraper.interface';
import { DomainException } from '../exceptions/domain.exception';
import { HtmlParserInterface } from '../interfaces/html-parser.interface';
import { ExternalApiException } from '../../../infrastructure/exceptions/external-api.exception';

@Injectable()
export class ScenarioRunnerService {
  private readonly logger = new Logger(ScenarioRunnerService.name);

  constructor(private readonly scenarioService: ScenarioService) {}

  public async runDirectApiParsers(
    url: string,
    domain: string,
    directApis: DirectApiInterface[],
  ): Promise<ParseResultVo> {
    const candidates = <ParseResultVo[]>[];

    for (const directApi of directApis) {
      try {
        const result = await directApi.getDataByUrl(url);

        candidates.push(result);

        await result.validate();
        const name = directApi.getName();
        // this.eventEmitter.emit(DirectApiSucceedEvent.name, new DirectApiSucceedEvent(name, result, domain, url));

        return result;
      } catch (e) {
        this.logger.log(`Got exception on attempt to parse the product data via the direct API parser. ${e.message}`);
      }
    }

    return this.scenarioService.collectData(candidates);
  }

  public async runHtmlParsers(
    html: string,
    url: string,
    htmlParsers: HtmlParserInterface[],
    yamlSchemaEntity?: YamlSchemaEntity,
  ): Promise<ParseResultVo> {
    const candidates = <ParseResultVo[]>[];

    for (const htmlParser of htmlParsers) {
      const parserName = htmlParser.getName();

      try {
        const result = await htmlParser.parseHtml(html, yamlSchemaEntity);

        candidates.push(result);

        await result.validate();

        // const domain = URLHelper.extractDomain(url);
        // this.eventEmitter.emit(HtmlParseSucceedEvent.name, new HtmlParseSucceedEvent(parserName, result, domain, url));

        return result;
      } catch (e) {
        this.logger.log(`Got exception on attempt to parse HTML via the ${parserName} parser. ${e.message}`);
      }
    }

    return this.scenarioService.collectData(candidates);
  }

  private checkIfNeedToTerminate(e: Error, url: string): void {
    if (e instanceof ExternalApiException && [410, 404].includes(e.getStatus())) {
      this.logger.error(
        `Default non-HTML scenario for the url ${url} failed. ${e.message}. Terminating the chain because of 4xx statuses`,
        e.stack,
      );

      throw e;
    }
  }

  public async runNoHtmlScenarioWithFallback(
    url: string,
    domain: string,
    domainStatEntity: DomainStatEntity,
    yamlSchemaEntity: YamlSchemaEntity,
  ): Promise<ParseResultVo> {
    const candidates = <ParseResultVo[]>[];

    // Primary
    const scrapers = await this.scenarioService.defineScrapers(domainStatEntity);
    const htmlParsers = await this.scenarioService.defineHtmlParsers(domainStatEntity);

    let parseResultVo: ParseResultVo;
    let scrapResultDto: ScrapResultDto;
    let shouldAttemptFallback = false;

    try {
      scrapResultDto = await this.runScrapers(url, scrapers);

      return await this.runHtmlParsers(scrapResultDto.html, url, htmlParsers, yamlSchemaEntity);
    } catch (e) {
      if (e instanceof NotEnoughProductDataException) {
        candidates.push(e.data);
      }

      this.checkIfNeedToTerminate(e, url);

      this.logger.log(`Failed primary scrapParseChain for the url ${url}. ${e.message}`);

      shouldAttemptFallback = yamlSchemaEntity && !parseResultVo && scrapResultDto?.html?.length > 300;
      if (!shouldAttemptFallback) {
        throw e;
      }
    }

    // Fallback ?
    if (shouldAttemptFallback) {
      const fallbackScrapers = await this.scenarioService.defineFallbackScrapers(domainStatEntity, scrapResultDto);

      try {
        scrapResultDto = await this.runScrapers(url, fallbackScrapers);

        return await this.runHtmlParsers(scrapResultDto.html, url, htmlParsers, yamlSchemaEntity);
      } catch (e) {
        if (e instanceof NotEnoughProductDataException) {
          candidates.push(e.data);
        }
      }
    }

    return this.scenarioService.collectData(candidates);
  }

  public async runScrapers(url: string, scrapers: ScraperInterface[]): Promise<ScrapResultDto> {
    for (const scraper of scrapers) {
      try {
        const result = await scraper.scrapByUrl(url);

        // this.eventEmitter.emit(
        //   ScrapSucceedEvent.name,
        //   new ScrapSucceedEvent(scraper.getName(), result, UrlHelper.extractDomain(url), url),
        // );

        return result;
      } catch (e) {
        this.logger.log(`Got exception on attempt to scrap the HTML. ${e.message}`);

        // abort further work as the product is gone
        if ((e.status && e.status === HttpStatus.GONE) || e.status === HttpStatus.NOT_FOUND) {
          throw e;
        }
      }
    }

    throw new DomainException(`Unable to scrap HTML via all available scrapers`);
  }
}
