import { SelectorInterface } from '../interfaces/selector.interface';
import { SelectorTypeEnum } from '../enums/selector-type.enum';

export class CssSelectorDto implements SelectorInterface {
  public type: SelectorTypeEnum;

  public selector: string;

  public attribute: string;

  constructor(cssClass: string, attribute: string) {
    this.type = SelectorTypeEnum.CSS;
    this.selector = cssClass;
    this.attribute = attribute;
  }
}
