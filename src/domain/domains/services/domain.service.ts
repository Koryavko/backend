import { Injectable } from '@nestjs/common';
import { DomainRepository } from '../../../infrastructure/database/repositories/domains/domain.repository';

@Injectable()
export class DomainService {
  constructor(private readonly domainRepository: DomainRepository) {}
}
