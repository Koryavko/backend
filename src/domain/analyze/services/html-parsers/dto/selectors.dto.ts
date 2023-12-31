import { SelectorInterface } from './selector.interface';

export class SelectorsDto {
  public title: SelectorInterface[];

  public image: SelectorInterface[];

  public price: SelectorInterface[];

  public priceOld: SelectorInterface[];

  public currency: SelectorInterface[];

  public availability: SelectorInterface[];

  public brand: SelectorInterface[];

  public description: SelectorInterface[];

  public rating: SelectorInterface[];

  public ean: SelectorInterface[];

  constructor(
    title: SelectorInterface[],
    image: SelectorInterface[],
    price: SelectorInterface[],
    priceOld: SelectorInterface[],
    currency: SelectorInterface[],
    availability: SelectorInterface[],
    brand: SelectorInterface[],
    description: SelectorInterface[],
    rating: SelectorInterface[],
    ean: SelectorInterface[],
  ) {
    this.title = title;
    this.image = image;
    this.price = price;
    this.priceOld = priceOld;
    this.currency = currency;
    this.availability = availability;
    this.brand = brand;
    this.description = description;
    this.rating = rating;
    this.ean = ean;
  }
}
