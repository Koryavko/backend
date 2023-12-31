import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainStatEntity } from '../../../../domain/domains/entities/domain-stat.entity';
import { DomainStatMapper } from '../../mappers/domains/domain-stat.mapper';

@Injectable()
export class DomainStatRepository extends Repository<DomainStatEntity> {
  constructor(
    @InjectRepository(DomainStatMapper)
    repository: Repository<DomainStatEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async findStatsForDomain(domain: string): Promise<DomainStatEntity> {
    return this.findOne({
      where: { domain },
    });
  }

  public async updateFailedByDomain(domain: string): Promise<void> {
    await this.increment({ domain }, 'failed', 1);
  }
}
