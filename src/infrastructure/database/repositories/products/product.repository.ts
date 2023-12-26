import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
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

  public async findByUrls(urls: string[]): Promise<ProductEntity> {
    return this.findOne({ where: { url: In(urls) } });
  }
}
