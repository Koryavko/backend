import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductColorEntity } from '../../../../domain/products/entities/product-color.entity';
import { ProductColorMapper } from '../../mappers/products/product-color.mapper';

@Injectable()
export class ProductColorRepository extends Repository<ProductColorEntity> {
  constructor(
    @InjectRepository(ProductColorMapper)
    repository: Repository<ProductColorEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
