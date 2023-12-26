import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../../../domain/products/entities/product.entity';
import { ProductMapper } from '../../mappers/products/product.mapper';

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
  constructor(
    @InjectRepository(ProductMapper)
    repository: Repository<ProductEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
