import { SelectorTypeEnum } from '../enums/selector-type.enum';
import { SelectorInterface } from './selector.interface';

export class XpathSelectorDto implements SelectorInterface {
  public type: SelectorTypeEnum;

  public selector: string;

  public attribute: string;

  constructor(value: string, attribute: string) {
    this.type = SelectorTypeEnum.XPATH;
    this.selector = value;
    this.attribute = attribute;
  }
}
