import { SelectorInterface } from '../interfaces/selector.interface';

export class SelectorsDto {
  public title: SelectorInterface[];

  public image: SelectorInterface[];

  public price: SelectorInterface[];

  public color: SelectorInterface[];

  public currency: SelectorInterface[];

  public availability: SelectorInterface[];

  public size: SelectorInterface[];

  public defaultCurrency: string;

  constructor(
    title: SelectorInterface[],
    image: SelectorInterface[],
    price: SelectorInterface[],
    size: SelectorInterface[],
    color: SelectorInterface[],
    currency: SelectorInterface[],
    availability: SelectorInterface[],
    defaultCurrency: string,
  ) {
    this.title = title;
    this.image = image;
    this.size = size;
    this.color = color;
    this.price = price;
    this.currency = currency;
    this.availability = availability;
    this.defaultCurrency = defaultCurrency;
  }
}
