import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductSizeEntity } from '../../../../domain/products/entities/product-size.entity';
import { ProductSizeMapper } from '../../mappers/products/product-size.mapper';

@Injectable()
export class ProductSizeRepository extends Repository<ProductSizeEntity> {
  constructor(
    @InjectRepository(ProductSizeMapper)
    repository: Repository<ProductSizeEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async findByProductId(productId: number): Promise<ProductSizeEntity[]> {
    return this.find({ where: { product: { id: productId } } });
  }
}
