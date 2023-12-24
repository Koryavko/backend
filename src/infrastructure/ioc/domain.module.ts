import { Module } from '@nestjs/common';
import { DomainController } from '../../presentation/controllers/domain.controller';
import { UserModule } from './user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainMapper } from '../database/mappers/domains/domain.mapper';
import { DomainRepository } from '../database/repositories/domains/domain.repository';
import { DomainService } from '../../domain/domains/services/domain.service';
import { GetPopularDomainsAction } from '../../application/domains/get-popular-domains.action';

@Module({
  imports: [TypeOrmModule.forFeature([DomainMapper]), UserModule],
  controllers: [DomainController],
  providers: [DomainRepository, DomainService, GetPopularDomainsAction],
  exports: [DomainRepository],
})
export class DomainModule {}
