import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler/dist/throttler-module-options.interface';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import Redis, { RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';

export class ThrottlersConfig implements ThrottlerOptionsFactory {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    if (!this.configService.get('REDIS_URL')) {
      throw new Error('REDIS_URL is not defined');
    }
  }

  public createThrottlerOptions(): ThrottlerModuleOptions {
    const options: RedisOptions = {};
    const path = `${this.configService.get('REDIS_URL')}/1`;
    if (this.configService.get('APP_ENV') !== 'local') {
      options.tls = {
        rejectUnauthorized: false,
      };
    }

    return {
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
      storage: new ThrottlerStorageRedisService(new Redis(path, options)),
    };
  }
}
