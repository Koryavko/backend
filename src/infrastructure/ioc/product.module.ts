import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductMapper } from '../database/mappers/products/product.mapper';
import { ProductPriceMapper } from '../database/mappers/products/product-price.mapper';
import { ProductSizeMapper } from '../database/mappers/products/product-size.mapper';
import { ProductColorMapper } from '../database/mappers/products/product-color.mapper';
import { ProductRepository } from '../database/repositories/products/product.repository';
import { ProductPriceRepository } from '../database/repositories/products/product-price.repository';
import { ProductSizeRepository } from '../database/repositories/products/product-size.repository';
import { ProductColorRepository } from '../database/repositories/products/product-color.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductMapper, ProductPriceMapper, ProductSizeMapper, ProductColorMapper])],
  controllers: [],
  providers: [ProductRepository, ProductPriceRepository, ProductSizeRepository, ProductColorRepository],
})
export class ProductModule {}
