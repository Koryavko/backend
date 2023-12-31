import { Injectable } from '@nestjs/common';
import { HtmlParserEnum } from '../enums/html-parser.enum';
import { HtmlParserInterface } from '../interfaces/html-parser.interface';
import { JsonLdParserService } from '../services/html-parsers/meta/json-ld-parser.service';
import { OpenGraphParserService } from '../services/html-parsers/meta/open-graph-parser.service';
import { SelectorParserService } from '../services/html-parsers/selector/selector-parser.service';

@Injectable()
export class HtmlParserFactory {
  public getHtmlParser(htmlParser: HtmlParserEnum): HtmlParserInterface {
    switch (htmlParser) {
      case HtmlParserEnum.SELECTOR:
        return new SelectorParserService();
      case HtmlParserEnum.META_OG:
        return new OpenGraphParserService();
      case HtmlParserEnum.META_JSON_LD:
        return new JsonLdParserService();
      default:
        throw new Error(`Failed to create instance for ${htmlParser} HTML parser`);
    }
  }
}
