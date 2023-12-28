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
import { ProductController } from '../../presentation/controllers/products/product.controller';
import { UserModule } from './user.module';
import { SaveProductFavoriteAction } from '../../application/products/save-product-favorite.action';
import { ProductPageFootprintModule } from './product-page-footprint.module';
import { ProductUrlService } from '../../domain/products/services/product-url.service';
import { ProductService } from '../../domain/products/services/product.service';
import { DomainModule } from './domain.module';
import { YamlModule } from './yaml.module';
import { ProductFavoriteMapper } from '../database/mappers/products/product-favorite.mapper';
import { ProductFavoriteRepository } from '../database/repositories/products/product-favorite.repository';
import { ProductFavoriteService } from '../../domain/products/services/product-favorite.service';
import { ProductParseAction } from '../../application/products/product-parse.action';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductMapper,
      ProductPriceMapper,
      ProductSizeMapper,
      ProductColorMapper,
      ProductFavoriteMapper,
    ]),
    UserModule,
    ProductPageFootprintModule,
    DomainModule,
    YamlModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductRepository,
    ProductPriceRepository,
    ProductSizeRepository,
    ProductColorRepository,
    SaveProductFavoriteAction,
    ProductUrlService,
    ProductService,
    ProductFavoriteRepository,
    ProductFavoriteService,
    ProductParseAction,
  ],
})
export class ProductModule {}
