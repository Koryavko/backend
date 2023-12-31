import { Injectable } from '@nestjs/common';
import { DiffbotApiService } from '../../../infrastructure/external/modules/direct-api/diffbot/diffbot-api.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { FnacApiService } from '../../../infrastructure/external/modules/direct-api/fnac/fnac-api.service';
import { ShopifyApiService } from '../../../infrastructure/external/modules/direct-api/shopify/shopify-api.service';
import { DirectApiEnum } from '../enums/direct-api.enum';
import { DirectApiInterface } from '../interfaces/direct-api-interface';

@Injectable()
export class DirectApiFactory {
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

  public getDirectApi(directApiEnum: DirectApiEnum): DirectApiInterface {
    switch (directApiEnum) {
      case DirectApiEnum.DIFFBOT:
        return new DiffbotApiService(this.httpService, this.configService);
      case DirectApiEnum.FNAC:
        return new FnacApiService(this.httpService, this.configService);
      case DirectApiEnum.SHOPIFY:
        return new ShopifyApiService(this.httpService);
      default:
        throw new Error(`Failed to create instance for ${directApiEnum} direct API`);
    }
  }
}
