import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { YamlSchemaMapper } from '../../mappers/yaml-schemas/yaml-schema.mapper';
import { YamlSchemaEntity } from '../../../../domain/yaml-schemas/entities/yaml-schema.entity';

@Injectable()
export class YamlSchemaRepository extends Repository<YamlSchemaEntity> {
  constructor(
    @InjectRepository(YamlSchemaMapper)
    repository: Repository<YamlSchemaEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async updateByDomainOrCreate(yamlSchemaEntity: YamlSchemaEntity): Promise<void> {
    await this.upsert(yamlSchemaEntity, { conflictPaths: ['domainName'], skipUpdateIfNoValuesChanged: true });
  }

  public async findByDomain(domain: string): Promise<YamlSchemaEntity> {
    return this.findOne({
      where: { domainName: domain },
    });
  }
}
