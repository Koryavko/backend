import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPageFootprintMapper } from '../database/mappers/product-page-footprints/product-page-footprint.mapper';
import { ProductPageFootprintRepository } from '../database/repositories/product-page-footprints/product-page-footprint.repository';
import { ProductPageFootprintController } from '../../presentation/controllers/domains/product-page-footprint.controller';
import { UserModule } from './user.module';
import { GetProductPageFootprintAction } from '../../application/product-page-footprints/get-product-page-footprint.action';
import { ProductPageFootprintService } from '../../domain/product-page-footprints/services/product-page-footprint.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductPageFootprintMapper]), UserModule],
  controllers: [ProductPageFootprintController],
  providers: [ProductPageFootprintRepository, GetProductPageFootprintAction, ProductPageFootprintService],
  exports: [ProductPageFootprintRepository, ProductPageFootprintService],
})
export class ProductPageFootprintModule {}
