import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlersConfig } from './infrastructure/configs/throttlers';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfig } from './infrastructure/configs/postgres';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfig } from './infrastructure/configs/redis';
import { UserModule } from './infrastructure/ioc/user.module';
import { DomainModule } from './infrastructure/ioc/domain.module';
import { YamlModule } from './infrastructure/ioc/yaml.module';

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
    UserModule,
    DomainModule,
    YamlModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
