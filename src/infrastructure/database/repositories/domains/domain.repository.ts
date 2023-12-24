import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainEntity } from '../../../../domain/domains/entities/domain.entity';
import { DomainMapper } from '../../mappers/domains/domain.mapper';
import { DomainTypeEnum } from '../../../../domain/domains/enums/domain-type.enum';

@Injectable()
export class DomainRepository extends Repository<DomainEntity> {
  constructor(
    @InjectRepository(DomainMapper)
    repository: Repository<DomainEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async getPopularDomains(type: DomainTypeEnum): Promise<DomainEntity[]> {
    return this.find({
      where: {
        type: type,
      },
      order: {
        rating: 'DESC',
      },
      take: 10,
    });
  }
}
