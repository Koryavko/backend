import { CacheOptionsFactory } from '@nestjs/cache-manager/dist/interfaces/cache-module.interface';
import { CacheModuleOptions } from '@nestjs/common/cache';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientOptions, RedisClientType } from 'redis';
import { redisInsStore } from 'cache-manager-redis-yet';

export class RedisConfig implements CacheOptionsFactory {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

  public async createCacheOptions(): Promise<CacheModuleOptions<Record<string, unknown>>> {
    const options = <RedisClientOptions>{
      url: this.configService.get<string>('REDIS_URL'),
      socket: {
        rejectUnauthorized: false,
        reconnectStrategy(): number {
          return 5000;
        },
      },
    };
    const redisCache = createClient(options);
    redisCache.on('error', () => {});
    const promise = new Promise((resolve, reject) => {
      redisCache.on('connect', resolve);
      redisCache.on('error', reject);
    });
    await redisCache.connect();
    await promise;

    return {
      store: await redisInsStore(redisCache as RedisClientType),
    };
  }
}
