import { DirectApiEnum } from '../enums/direct-api.enum';
import { ParseResultVo } from '../vo/parse-result.vo';

export interface DirectApiInterface {
  getDataByUrl(url: string): Promise<ParseResultVo>;

  getName(): DirectApiEnum;
}
