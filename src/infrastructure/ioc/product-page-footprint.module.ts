import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPageFootprintMapper } from '../database/mappers/product-page-footprints/product-page-footprint.mapper';
import { ProductPageFootprintRepository } from '../database/repositories/product-page-footprints/product-page-footprint.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductPageFootprintMapper])],
  controllers: [],
  providers: [ProductPageFootprintRepository],
  exports: [ProductPageFootprintRepository],
})
export class ProductPageFootprintModule {}
