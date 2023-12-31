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

  public async countProductToCheck(): Promise<number> {
    return this.countBy({ isDone: false });
  }

  public async findProductsToCheck(offset: number, limit: number): Promise<ProductFavoriteEntity[]> {
    return this.find({ where: { isDone: false }, skip: offset, take: limit, relations: ['product'] });
  }
}
