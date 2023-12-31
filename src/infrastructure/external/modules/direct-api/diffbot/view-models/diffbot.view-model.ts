import { plainToClass } from 'class-transformer';
import { CurrencySignToCodeHelper } from '../../../../../../domain/analyze/helpers/currency-sign-to-code.helper';

export class DiffbotViewModel {
  public price: string;

  public currency: string;

  public image: string;

  public title: string;

  public description: string;

  public brand: string;

  public availability: string;

  public static createFromRawApiResponse(rawResponse: Record<string, any>): DiffbotViewModel {
    const requestUrl = rawResponse?.data?.request?.pageUrl;
    const resolvedUrl = rawResponse?.data?.request?.resolvedPageUrl;
    if (requestUrl && resolvedUrl && requestUrl !== resolvedUrl) {
      return null;
    }

    const object = rawResponse?.data?.objects[0];
    if (!object) {
      return null;
    }

    return plainToClass(DiffbotViewModel, {
      price: object?.offerPriceDetails?.amount ? String(object.offerPriceDetails.amount) : null,
      currency: object?.offerPriceDetails?.symbol
        ? String(CurrencySignToCodeHelper.signToCode(object.offerPriceDetails.symbol))
        : null,
      image: object?.images[0].url ? object.images[0].url : null,
      title: object?.title ? String(object.title) : null,
      description: object?.text ? String(object.text) : null,
      brand: object?.brand ? String(object.brand) : null,
      availability: object?.availability ? String(object.availability) : null,
    });
  }
}
