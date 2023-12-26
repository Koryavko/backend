import { Module } from '@nestjs/common';
import { YamlUpdateService } from '../../domain/yaml-schemas/services/yaml-update.service';
import { GoogleCloudService } from '../external/modules/gcp/google-cloud.service';
import { FetchYamlsService } from '../external/modules/gcp/fetch-yamls.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YamlSchemaRepository } from '../database/repositories/yaml-schemas/yaml-schema.repository';
import { DomainModule } from './domain.module';
import { YamlSchemaMapper } from '../database/mappers/yaml-schemas/yaml-schema.mapper';
import { YamlSchemasController } from '../../presentation/controllers/yaml-schemas.controller';
import { UserModule } from './user.module';
import { GetProductParseRulesAction } from '../../application/yaml-schemas/get-product-parse-rules.action';
import { YamlSchemaService } from '../../domain/yaml-schemas/services/yaml-schema.service';

@Module({
  imports: [TypeOrmModule.forFeature([YamlSchemaMapper]), DomainModule, UserModule],
  controllers: [YamlSchemasController],
  providers: [
    YamlUpdateService,
    GoogleCloudService,
    FetchYamlsService,
    YamlSchemaRepository,
    GetProductParseRulesAction,
    YamlSchemaService,
  ],
  exports: [YamlSchemaRepository],
})
export class YamlModule {}
