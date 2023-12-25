import { SharedBullConfigurationFactory } from '@nestjs/bull/dist/interfaces/shared-bull-config.interface';
import { BullRootModuleOptions } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class BullConfig implements SharedBullConfigurationFactory {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    if (!this.configService.get('REDIS_URL')) {
      throw new Error('REDIS_URL is not defined');
    }
  }

  public createSharedConfiguration(): BullRootModuleOptions {
    return {
      url: this.configService.get<string>('REDIS_URL'),
    };
  }
}
