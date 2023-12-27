import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductFavoriteEntity } from '../../../../domain/products/entities/product-favorite.entity';
import { ProductFavoriteMapper } from '../../mappers/products/product-favorite.mapper';

export class ProductFavoriteRepository extends Repository<ProductFavoriteEntity> {
  constructor(
    @InjectRepository(ProductFavoriteMapper)
    repository: Repository<ProductFavoriteEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
