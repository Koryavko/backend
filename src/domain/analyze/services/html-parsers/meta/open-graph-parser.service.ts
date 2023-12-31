import { ParseResultVo } from '../../../vo/parse-result.vo';
import { Injectable } from '@nestjs/common';
import { HtmlVo } from '../vo/html.vo';
import { SelectorsDto } from '../dto/selectors.dto';
import { CssSelectorDto } from '../dto/css-selector.dto';
import { HtmlParserEnum } from '../../../enums/html-parser.enum';
import { HtmlParserInterface } from '../../../interfaces/html-parser.interface';

@Injectable()
export class OpenGraphParserService implements HtmlParserInterface {
  public async parseHtml(html: string): Promise<ParseResultVo> {
    const htmlVo = new HtmlVo(html);
    const selectors = this.getMetaSelectors();

    return new ParseResultVo(
      htmlVo.extractBySelectors(selectors.title),
      htmlVo.extractBySelectors(selectors.price),
      htmlVo.extractBySelectors(selectors.currency),
      htmlVo.extractBySelectors(selectors.image),
      htmlVo.extractBySelectors(selectors.brand),
      htmlVo.extractBySelectors(selectors.priceOld),
      htmlVo.extractBySelectors(selectors.availability),
      htmlVo.extractBySelectors(selectors.description),
      htmlVo.extractBySelectors(selectors.rating),
      htmlVo.extractBySelectors(selectors.ean),
    );
  }

  private getMetaSelectors(): SelectorsDto {
    return new SelectorsDto(
      [new CssSelectorDto('meta[property=og:title]', 'content')],
      [new CssSelectorDto('meta[property=og:image]', 'content')],
      [
        new CssSelectorDto('meta[property=og:product:price:amount]', 'content'),
        new CssSelectorDto('meta[property=og:price:amount]', 'content'),
        new CssSelectorDto('meta[property=product:price:amount]', 'content'),
        new CssSelectorDto('meta[property=price:amount]', 'content'),
      ],
      [],
      [
        new CssSelectorDto('meta[property=og:product:price:currency]', 'content'),
        new CssSelectorDto('meta[property=og:price:currency]', 'content'),
        new CssSelectorDto('meta[property=product:price:currency]', 'content'),
        new CssSelectorDto('meta[property=price:currency]', 'content'),
      ],
      [new CssSelectorDto('meta[property=og:product:availability]', 'content')],
      [],
      [new CssSelectorDto('meta[property=og:description]', 'content')],
      [],
      [],
    );
  }

  public getName(): HtmlParserEnum {
    return HtmlParserEnum.META_OG;
  }
}
