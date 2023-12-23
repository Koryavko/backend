import { BrowserEnum } from '../enums/browser.enum';

export class UserEntity {
  public id: number;

  public locale: string;

  public uuid: string;

  public browser: BrowserEnum;

  public userAgent: string;

  public createdAt: Date;

  public updatedAt: Date;

  public deletedAt: Date;

  constructor(locale: string, userAgent: string, browser: BrowserEnum) {
    this.locale = locale;
    this.browser = browser;
    this.userAgent = userAgent;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
