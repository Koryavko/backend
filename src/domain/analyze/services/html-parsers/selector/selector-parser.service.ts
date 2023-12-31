import { ParseResultVo } from '../../../vo/parse-result.vo';
import { Injectable } from '@nestjs/common';
import { HtmlVo } from '../vo/html.vo';
import { SelectorsDto } from '../dto/selectors.dto';
import { SelectorInterface } from '../dto/selector.interface';
import { CssSelectorDto } from '../dto/css-selector.dto';
import { XpathSelectorDto } from '../dto/xpath-selector.dto';
import { HtmlParserEnum } from '../../../enums/html-parser.enum';
import { DomainException } from '../../../exceptions/domain.exception';
import { HtmlParserInterface } from '../../../interfaces/html-parser.interface';
import { YamlSchemaEntity } from '../../../../yaml-schemas/entities/yaml-schema.entity';

@Injectable()
export class SelectorParserService implements HtmlParserInterface {
  public async parseHtml(html: string, yamlSchemaEntity?: YamlSchemaEntity): Promise<ParseResultVo> {
    if (!yamlSchemaEntity) {
      throw new DomainException(`Cannot use selector parser without the predefined selectors`);
    }

    const selectors = this.extractSelectors(yamlSchemaEntity);

    const htmlVo = new HtmlVo(html);

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

  public extractSelectors(yamlSchemaEntity: YamlSchemaEntity): SelectorsDto {
    return new SelectorsDto(
      this.extractSelectorsByTypes(yamlSchemaEntity.title),
      this.extractSelectorsByTypes(yamlSchemaEntity.image),
      this.extractSelectorsByTypes(yamlSchemaEntity.price),
      // this.extractSelectorsByTypes(yamlSchemaEntity.priceOld),
      null,
      this.extractSelectorsByTypes(yamlSchemaEntity.currency),
      this.extractSelectorsByTypes(yamlSchemaEntity.availability),
      null,
      null,
      null,
      // this.extractSelectorsByTypes(yamlSchemaEntity.brand),
      // this.extractSelectorsByTypes(yamlSchemaEntity.description),
      // this.extractSelectorsByTypes(yamlSchemaEntity.rating),
      this.extractSelectorsByTypes(yamlSchemaEntity.ean),
    );
  }

  private extractSelectorsByTypes(source: Record<string, unknown>): SelectorInterface[] {
    if (!source || !source.children) {
      return [];
    }

    const result = [];

    for (const value of Object.values(source.children)) {
      if (value.type === 'Attribute' && value?.css) {
        result.push(new CssSelectorDto(value.css, value?.attribute));
      }

      if (value.type === 'Attribute' && value?.xpath) {
        result.push(new XpathSelectorDto(value.xpath, value?.attribute));
      }

      if (value.type === 'Text' && value?.css) {
        result.push(new CssSelectorDto(value.css, null));
      }

      if (value.type === 'Text' && value?.xpath) {
        result.push(new XpathSelectorDto(value.xpath, null));
      }

      if (value.type === 'Image' && value?.css) {
        result.push(new CssSelectorDto(value.css, 'src'));
      }

      if (value.type === 'Image' && value?.xpath) {
        result.push(new XpathSelectorDto(value.xpath, 'src'));
      }
    }

    return result;
  }

  public getName(): HtmlParserEnum {
    return HtmlParserEnum.SELECTOR;
  }
}
