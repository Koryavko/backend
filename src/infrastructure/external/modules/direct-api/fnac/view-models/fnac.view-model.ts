import { plainToClass } from 'class-transformer';

export class FnacViewModel {
  public price: string;

  public currency: string;

  public image: string;

  public title: string;

  public description: string;

  public brand: string;

  public availability: string;

  public static createFromRawApiResponse(rawResponse: Record<string, any>): FnacViewModel {
    if (!rawResponse) {
      return null;
    }

    const values = Object.values(rawResponse.data);
    const object = <Record<string, unknown>>values[0];
    if (!object) {
      return null;
    }

    const prices = <number[]>object.timesAndPricesSortedAscTime;
    const price = prices.pop();

    return plainToClass(FnacViewModel, {
      price: price[1] ? String(price[1]) : null,
      currency: 'EUR',
      image: object.pictureHref ? String(object.pictureHref) : null,
      title: object.name ? String(object.name) : null,
      description: null,
      brand: object.brand ? String(object.brand) : null,
      availability: object.available ? String(object.available) : null,
    });
  }
}
