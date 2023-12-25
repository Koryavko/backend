import { Injectable, Logger } from '@nestjs/common';
import { GoogleCloudService } from './google-cloud.service';
import * as yaml from 'js-yaml';
import { DomainEntity } from '../../../../domain/domains/entities/domain.entity';
import { DomainRepository } from '../../../database/repositories/domains/domain.repository';
import { DomainTypeEnum } from '../../../../domain/domains/enums/domain-type.enum';
import { YamlSchemaEntity } from '../../../../domain/yaml-schemas/entities/yaml-schema.entity';

@Injectable()
export class FetchYamlsService {
  private readonly logger = new Logger(FetchYamlsService.name);

  private readonly bucket = 'product-data-bucket';

  private readonly batch = 100;

  private readonly directory = 'yaml-selectors/';

  constructor(
    private readonly googleCloudService: GoogleCloudService,
    private readonly domainRepository: DomainRepository,
  ) {}

  private async getFilesList(): Promise<string[]> {
    const files = await this.googleCloudService.getDirectoryFiles(this.bucket, this.directory);

    this.logger.log(`Found ${files.length} schemas...`);

    return files;
  }

  public async prepareEntities(): Promise<YamlSchemaEntity[]> {
    const schemas: YamlSchemaEntity[] = [];
    const fileNames = await this.getFilesList();

    while (fileNames.length > 0) {
      const batch = fileNames.splice(0, this.batch);

      const yamlSchemaEntities = await this.handleBatch(batch);
      schemas.push(...yamlSchemaEntities);
    }

    return schemas;
  }

  private async handleBatch(fileNames: string[]): Promise<YamlSchemaEntity[]> {
    const entities: YamlSchemaEntity[] = [];

    for (const fileName of fileNames) {
      const file = await this.googleCloudService.download(this.bucket, fileName, {});
      const plain = file[0].toString('utf8');
      try {
        const parsed = <Record<string, Record<string, unknown>>>yaml.load(plain);

        const entity = await this.mapRawDataToEntity(fileName, parsed);
        entities.push(entity);
      } catch (e) {
        this.logger.error(`Unable to parse yaml schema for domain ${fileName}. ${e.message}`, e.stack);
      }
    }

    return entities.filter(Boolean);
  }

  private async getDomainEntity(
    fileName: string,
    raw: Record<string, Record<string, unknown> | string>,
  ): Promise<DomainEntity> {
    const domainName = fileName.replace(this.directory, '').replace('.yml', '');
    let domainEntity = await this.domainRepository.findOneByDomain(domainName);
    if (domainEntity) {
      return domainEntity;
    }

    const url = raw?.URL ? <string>raw.URL : `https://${domainName}`;
    const logo = raw?.Logo ? <string>raw.Logo : null;
    const type = raw?.Type ? <DomainTypeEnum>raw.Type : DomainTypeEnum.WORLD;
    domainEntity = new DomainEntity(domainName, url, logo, 0, type);

    return this.domainRepository.save(domainEntity);
  }

  private async mapRawDataToEntity(
    fileName: string,
    raw: Record<string, Record<string, unknown> | string>,
  ): Promise<YamlSchemaEntity> {
    if (!raw || !Object.entries(raw).length) {
      return;
    }

    const domainEntity = await this.getDomainEntity(fileName, raw);
    const title = raw?.Title ? <Record<string, unknown>>raw.Title : null;
    const price = raw?.Price ? <Record<string, unknown>>raw.Price : null;
    const image = raw?.Image ? <Record<string, unknown>>raw.Image : null;
    const currency = raw?.Currency ? <Record<string, unknown>>raw.Currency : null;
    const availability = raw?.Availability ? <Record<string, unknown>>raw.Availability : null;
    const size = raw?.Size ? <Record<string, unknown>>raw.Size : null;
    const color = raw?.Color ? <Record<string, unknown>>raw.Color : null;
    const defaultCurrency = raw?.DefaultCurrency ? <string>raw.DefaultCurrency : null;

    return new YamlSchemaEntity(
      domainEntity,
      domainEntity.domain,
      title,
      image,
      price,
      color,
      availability,
      size,
      currency,
      defaultCurrency,
    );
  }
}
