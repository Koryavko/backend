import { CURRENCIES } from '../data/currencies';

export class CurrencySignToCodeHelper {
  public static signToCode(input: string): string {
    const currency = Object.values(CURRENCIES).find((dataCurrency) => dataCurrency.symbol === input);

    if (!currency) {
      return input;
    }

    return currency.code;
  }
}
