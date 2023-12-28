import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { SaveFavoriteProductRequest } from '../../presentation/requests/products/save-favorite-product.request';
import { ProductUrlService } from '../../domain/products/services/product-url.service';
import { URLHelper } from '../../domain/utillity/helpers/url.helper';
import { ProductService } from '../../domain/products/services/product.service';
import { ProductRepository } from '../../infrastructure/database/repositories/products/product.repository';
import { ProductEntity } from '../../domain/products/entities/product.entity';
import { ProductFavoriteService } from '../../domain/products/services/product-favorite.service';
import { UserEntity } from '../../domain/users/entities/user.entity';
import { DomainRepository } from '../../infrastructure/database/repositories/domains/domain.repository';
import { DomainEntity } from '../../domain/domains/entities/domain.entity';

@Injectable()
export class SaveProductFavoriteAction {
  private readonly logger = new Logger(SaveProductFavoriteAction.name);

  constructor(
    private readonly productUrlService: ProductUrlService,
    private readonly productService: ProductService,
    private readonly productRepository: ProductRepository,
    private readonly productFavoriteService: ProductFavoriteService,
    private readonly domainRepository: DomainRepository,
  ) {}

  public async execute(body: SaveFavoriteProductRequest, user: UserEntity): Promise<void> {
    const isValidProductUrl = await this.productService.validateProductUrl(body.url).catch((e) => {
      this.logger.error(`Error while validating product url: ${e.message}`, e.stack);

      return false;
    });
    if (!isValidProductUrl) {
      throw new ConflictException('Invalid product url');
    }

    body.url = await this.productUrlService.transformUrl(body.url);
    const urls = URLHelper.getUrlWWW(body.url);
    let product: ProductEntity;
    let domain: DomainEntity;

    [product, body.currency, domain] = await Promise.all([
      this.productRepository.findByUrls(urls),
      body.currency || this.productService.getDefaultCurrency(body.url),
      this.domainRepository.findOneByDomain(URLHelper.extractDomain(body.url)),
    ]);

    if (product) {
      product = await this.productService.updateProduct(product, body);
    } else {
      product = await this.productService.createProduct(body, domain);
    }

    try {
      await Promise.all([
        this.productRepository.save(product),
        this.productFavoriteService.saveFavorites(product, user, body),
      ]);
    } catch (e) {
      this.logger.error(`Error while saving product: ${e.message}`, e.stack);

      throw new BadRequestException('Error while saving product');
    }
  }
}
