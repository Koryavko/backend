import { SelectorTypeEnum } from '../enums/selector-type.enum';

export interface SelectorInterface {
  type: SelectorTypeEnum;

  selector: string;

  attribute: string;
}
