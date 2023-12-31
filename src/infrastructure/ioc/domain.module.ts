import { Module } from '@nestjs/common';
import { DomainController } from '../../presentation/controllers/domains/domain.controller';
import { UserModule } from './user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainMapper } from '../database/mappers/domains/domain.mapper';
import { DomainRepository } from '../database/repositories/domains/domain.repository';
import { DomainService } from '../../domain/domains/services/domain.service';
import { GetPopularDomainsAction } from '../../application/domains/get-popular-domains.action';
import { GetDomainListAction } from '../../application/domains/get-domain-list.action';
import { DomainImportantQueryParamMapper } from '../database/mappers/domains/domain-important-query-param.mapper';
import { DomainImportantQueryParamRepository } from '../database/repositories/domains/domain-important-query-param.repository';
import { DomainStatMapper } from '../database/mappers/domains/domain-stat.mapper';
import { DomainStatRepository } from '../database/repositories/domains/domain-stat.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DomainMapper, DomainImportantQueryParamMapper, DomainStatMapper]), UserModule],
  controllers: [DomainController],
  providers: [
    DomainRepository,
    DomainService,
    GetPopularDomainsAction,
    GetDomainListAction,
    DomainImportantQueryParamRepository,
    DomainStatRepository,
  ],
  exports: [UserModule, DomainRepository, DomainImportantQueryParamRepository, DomainStatRepository],
})
export class DomainModule {}
