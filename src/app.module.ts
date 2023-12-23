import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlersConfig } from './infrastructure/configs/throttlers';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfig } from './infrastructure/configs/postgres';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfig } from './infrastructure/configs/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      useClass: ThrottlersConfig,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfig,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: RedisConfig,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
