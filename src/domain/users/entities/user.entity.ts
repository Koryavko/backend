import { BrowserEnum } from '../enums/browser.enum';
import { PlatformEnum } from '../enums/platform.enum';

export class UserEntity {
  public id: number;

  public locale: string;

  public currentLocale: string;

  public uuid: string;

  public browser: BrowserEnum;

  public platform: PlatformEnum;

  public userAgent: string;

  public createdAt: Date;

  public updatedAt: Date;

  public deletedAt: Date;

  constructor(locale: string, userAgent: string, browser: BrowserEnum, platform: PlatformEnum) {
    this.locale = locale;
    this.browser = browser;
    this.platform = platform;
    this.userAgent = userAgent;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
