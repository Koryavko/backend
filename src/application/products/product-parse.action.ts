import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ProductParseRequest } from '../../presentation/requests/products/product-parse.request';
import { ProductUrlService } from '../../domain/products/services/product-url.service';
import { ProductService } from '../../domain/products/services/product.service';
import { ProductRepository } from '../../infrastructure/database/repositories/products/product.repository';
import { URLHelper } from '../../domain/utillity/helpers/url.helper';

@Injectable()
export class ProductParseAction {
  private readonly logger = new Logger(ProductParseAction.name);

  constructor(
    private readonly productUrlService: ProductUrlService,
    private readonly productService: ProductService,
    private readonly productRepository: ProductRepository,
  ) {}

  public async execute(body: ProductParseRequest): Promise<void> {
    const isValidProductUrl = await this.productService.validateProductUrl(body.url).catch((e) => {
      this.logger.error(`Error while validating product url: ${e.message}`, e.stack);

      return false;
    });
    if (!isValidProductUrl) {
      throw new ConflictException('Invalid product url');
    }

    body.url = await this.productUrlService.transformUrl(body.url);
    const urls = URLHelper.getUrlWWW(body.url);
    const product = await this.productRepository.findByUrls(urls);
    if (!product) {
      return null;
    }

    if (!body.currency) {
      body.currency = await this.productService.getDefaultCurrency(body.url);
    }

    await this.productService.updateProduct(product, body);
  }
}
