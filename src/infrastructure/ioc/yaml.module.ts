import { Module } from '@nestjs/common';
import { YamlUpdateService } from '../../domain/yaml-schemas/services/yaml-update.service';
import { GoogleCloudService } from '../external/modules/gcp/google-cloud.service';
import { FetchYamlsService } from '../external/modules/gcp/fetch-yamls.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YamlSchemaRepository } from '../database/repositories/yaml-schemas/yaml-schema.repository';
import { DomainModule } from './domain.module';
import { YamlSchemaMapper } from '../database/mappers/yaml-schemas/yaml-schema.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([YamlSchemaMapper]), DomainModule],
  controllers: [],
  providers: [YamlUpdateService, GoogleCloudService, FetchYamlsService, YamlSchemaRepository],
})
export class YamlModule {}
