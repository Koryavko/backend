import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductPriceEntity } from '../../../../domain/products/entities/product-price.entity';
import { ProductPriceMapper } from '../../mappers/products/product-price.mapper';

@Injectable()
export class ProductPriceRepository extends Repository<ProductPriceEntity> {
  constructor(
    @InjectRepository(ProductPriceMapper)
    repository: Repository<ProductPriceEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
