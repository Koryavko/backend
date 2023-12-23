import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlersConfig } from './infrastructure/configs/throttlers';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfig } from './infrastructure/configs/postgres';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfig } from './infrastructure/configs/redis';
import { UserModule } from './infrastructure/ioc/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './infrastructure/configs/jwt';
import { UserLocaleMiddleware } from './infrastructure/rest/middlewares/user-locale.middleware';

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
    JwtModule.registerAsync({
      global: true,
      useClass: JwtConfig,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(UserLocaleMiddleware).forRoutes('*');
  }
}
{
}
