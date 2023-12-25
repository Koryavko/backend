import { SelectorInterface } from '../interfaces/selector.interface';
import { SelectorTypeEnum } from '../enums/selector-type.enum';

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
