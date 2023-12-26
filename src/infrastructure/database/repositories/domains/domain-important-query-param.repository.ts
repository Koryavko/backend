import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainImportantQueryParamsEntity } from '../../../../domain/domains/entities/domain-important-query-params.entity';
import { DomainImportantQueryParamMapper } from '../../mappers/domains/domain-important-query-param.mapper';

@Injectable()
export class DomainImportantQueryParamRepository extends Repository<DomainImportantQueryParamsEntity> {
  constructor(
    @InjectRepository(DomainImportantQueryParamMapper)
    repository: Repository<DomainImportantQueryParamsEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async findByDomainName(domainName: string): Promise<DomainImportantQueryParamsEntity[]> {
    return this.find({
      where: {
        domainName,
      },
    });
  }
}
