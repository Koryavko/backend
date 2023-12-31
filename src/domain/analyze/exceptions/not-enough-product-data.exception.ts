import { ParseResultVo } from '../vo/parse-result.vo';

export class NotEnoughProductDataException extends Error {
  public data: ParseResultVo;

  constructor(message: string, data: ParseResultVo) {
    super(message);

    this.data = data;
  }
}
