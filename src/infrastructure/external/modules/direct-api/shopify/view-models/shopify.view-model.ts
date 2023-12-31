import { plainToClass } from 'class-transformer';
import striptags from 'striptags';

export class ShopifyViewModel {
  public price: string;

  public currency: string;

  public image: string;

  public title: string;

  public description: string;

  public brand: string;

  public availability: string;

  public static createFromRawApiResponse(rawResponse: Record<string, any>): ShopifyViewModel {
    const object = rawResponse?.data?.product;
    if (!object || !object?.variants) {
      return null;
    }

    const price = object.variants[0];

    return plainToClass(ShopifyViewModel, {
      price: price ? String(price.price) : null,
      currency: 'EUR',
      image: object.image?.src ? String(object.image.src) : null,
      title: object.title ? String(object.title) : null,
      description: object.body_html
        ? striptags(
            String(object.body_html)
              .replace('<br>', ' ')
              .replace(/\s{2,}/g, ' '),
          )
        : null,
      brand: object.vendor ? String(object.vendor) : null,
      availability: null,
    });
  }
}
