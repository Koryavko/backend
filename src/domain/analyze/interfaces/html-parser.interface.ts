import { ParseResultVo } from '../vo/parse-result.vo';
import { HtmlParserEnum } from '../enums/html-parser.enum';
import { YamlSchemaEntity } from '../../yaml-schemas/entities/yaml-schema.entity';

export interface HtmlParserInterface {
  parseHtml(html: string, yamlSchemaEntity: YamlSchemaEntity): Promise<ParseResultVo>;

  getName(): HtmlParserEnum;
}
