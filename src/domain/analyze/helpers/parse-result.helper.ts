import { ParseResultVo } from '../vo/parse-result.vo';

export class ParseResultHelper {
  public static merge(parseResultVos: ParseResultVo[]): ParseResultVo {
    const result = new ParseResultVo(null, null, null, null, null, null, null, null, null, null);

    for (const parseResult of parseResultVos) {
      result.title = parseResult.title && !result.title ? parseResult.title : result.title;
      result.price = parseResult.price && !result.price ? parseResult.price : result.price;
      result.availability =
        parseResult.availability && !result.availability ? parseResult.availability : result.availability;
      result.currency = parseResult.currency && !result.currency ? parseResult.currency : result.currency;
      result.image = parseResult.image && !result.image ? parseResult.image : result.image;
      result.brand = parseResult.brand && !result.brand ? parseResult.brand : result.brand;
      result.priceOld = parseResult.priceOld && !result.priceOld ? parseResult.priceOld : result.priceOld;
      result.rating = parseResult.rating && !result.rating ? parseResult.rating : result.rating;
      result.ean = parseResult.ean && !result.ean ? parseResult.ean : result.ean;
      result.description =
        parseResult.description && !result.description ? parseResult.description : result.description;
    }

    return result;
  }
}
