import { Injectable, Logger } from '@nestjs/common';
import { ProductFavoriteRepository } from '../../../infrastructure/database/repositories/products/product-favorite.repository';
import { ProductFavoriteEntity } from '../../products/entities/product-favorite.entity';
import { CheckProductService } from '../services/check-product.service';

@Injectable()
export class CheckProductConsole {
  private readonly logger = new Logger(CheckProductConsole.name);

  private readonly batch = 100;

  constructor(
    private readonly productFavoriteRepository: ProductFavoriteRepository,
    private readonly checkProductService: CheckProductService,
  ) {}

  private async favoriteProductsLoop(favorites: ProductFavoriteEntity[]): Promise<void> {
    for (const favoriteElement of favorites) {
      try {
        const result = await this.checkProductService.checkProduct(favoriteElement);
        console.log(result, 'result');
      } catch (e) {
        this.logger.error(`Scenarios failed as the first step. ${e.message}`, e.stack);
      }
    }
  }

  public async sync(): Promise<void> {
    let countProduct = await this.productFavoriteRepository.countProductToCheck();
    let offset = 0;

    while (countProduct > 0) {
      const products = await this.productFavoriteRepository.findProductsToCheck(offset, this.batch);
      await this.favoriteProductsLoop(products);

      countProduct -= this.batch;
      offset += this.batch;
    }
  }
}
