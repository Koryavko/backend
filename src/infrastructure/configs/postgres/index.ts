import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class PostgresConfig implements TypeOrmOptionsFactory {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const isLocalEnv = this.configService.get('APP_ENV') === 'local';

    return {
      type: 'postgres',
      replication: {
        master: {
          url: this.configService.get('DATABASE_URL'),
        },
        slaves: [
          {
            url: this.configService.get('DATABASE_URL'),
          },
        ],
      },

      entities: ['dist/infrastructure/database/mappers/*.js'],

      synchronize: false,

      logging: isLocalEnv,
      logger: 'file',

      migrationsRun: true,
      migrationsTableName: 'migrations',
      migrations: ['dist/infrastructure/database/migrations/*.js'],

      extra: {
        ssl: !isLocalEnv
          ? {
              rejectUnauthorized: false,
            }
          : false,
      },
    };
  }
}
