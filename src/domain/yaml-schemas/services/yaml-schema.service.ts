import { Injectable } from '@nestjs/common';
import { SelectorInterface } from '../interfaces/selector.interface';
import { CssSelectorDto } from '../dto/css-selector.dto';
import { XpathSelectorDto } from '../dto/xpath-selector.dto';
import { YamlSchemaEntity } from '../entities/yaml-schema.entity';
import { SelectorsDto } from '../dto/selectors.dto';

@Injectable()
export class YamlSchemaService {
  public extractSelectors(yamlSchemaEntity: YamlSchemaEntity): SelectorsDto {
    return new SelectorsDto(
      this.extractSelectorsByTypes(yamlSchemaEntity.title),
      this.extractSelectorsByTypes(yamlSchemaEntity.image),
      this.extractSelectorsByTypes(yamlSchemaEntity.price),
      this.extractSelectorsByTypes(yamlSchemaEntity.size),
      this.extractSelectorsByTypes(yamlSchemaEntity.color),
      this.extractSelectorsByTypes(yamlSchemaEntity.currency),
      this.extractSelectorsByTypes(yamlSchemaEntity.availability),
      yamlSchemaEntity.defaultCurrency,
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
}
