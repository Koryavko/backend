import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { SaveFavoriteProductRequest } from '../../presentation/requests/products/save-favorite-product.request';
import { ProductUrlService } from '../../domain/products/services/product-url.service';
import { URLHelper } from '../../domain/utillity/helpers/url.helper';
import { ProductService } from '../../domain/products/services/product.service';
import { ProductRepository } from '../../infrastructure/database/repositories/products/product.repository';

@Injectable()
export class SaveProductFavoriteAction {
  private readonly logger = new Logger(SaveProductFavoriteAction.name);

  constructor(
    private readonly productUrlService: ProductUrlService,
    private readonly productService: ProductService,
    private readonly productRepository: ProductRepository,
  ) {}

  public async execute(body: SaveFavoriteProductRequest, locale: string): Promise<void> {
    const isValidProductUrl = await this.productService.validateProductUrl(body.url).catch((e) => {
      this.logger.error(`Error while validating product url: ${e.message}`, e.stack);

      return false;
    });
    if (!isValidProductUrl) {
      throw new ConflictException('Invalid product url');
    }

    body.url = await this.productUrlService.transformUrl(body.url);
    const urls = URLHelper.getUrlWWW(body.url);
    // eslint-disable-next-line prefer-const
    let [product, currency] = await Promise.all([
      this.productRepository.findByUrls(urls),
      !body.currency && this.productService.getDefaultCurrency(body.url),
    ]);
    if (currency) {
      body.currency = currency;
    }

    if (product) {
      product = await this.productService.updateProduct(product, body);
    } else {
      product = await this.productService.createProduct(body);
    }

    // TODO Save to favorite table
    try {
      await this.productRepository.save(product);
    } catch (e) {
      this.logger.error(`Error while saving product: ${e.message}`, e.stack);

      throw new BadRequestException('Error while saving product');
    }
  }
}
