import { Injectable, Logger } from '@nestjs/common';
import { ProductPageFootprintService } from '../../product-page-footprints/services/product-page-footprint.service';
import { URLHelper } from '../../utillity/helpers/url.helper';
import { ProductEntity } from '../entities/product.entity';
import { SaveFavoriteProductRequest } from '../../../presentation/requests/products/save-favorite-product.request';
import { ProductPriceEntity } from '../entities/product-price.entity';
import { ProductPriceRepository } from '../../../infrastructure/database/repositories/products/product-price.repository';
import { ProductSizeRepository } from '../../../infrastructure/database/repositories/products/product-size.repository';
import { ProductColorRepository } from '../../../infrastructure/database/repositories/products/product-color.repository';
import { ProductSizeEntity } from '../entities/product-size.entity';
import { ProductColorEntity } from '../entities/product-color.entity';
import { YamlSchemaRepository } from '../../../infrastructure/database/repositories/yaml-schemas/yaml-schema.repository';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly pageFootprintService: ProductPageFootprintService,
    private readonly productPriceRepository: ProductPriceRepository,
    private readonly productSizeRepository: ProductSizeRepository,
    private readonly productColorRepository: ProductColorRepository,
    private readonly yamlSchemaRepository: YamlSchemaRepository,
  ) {}

  public async validateProductUrl(url: string): Promise<boolean> {
    const domain = URLHelper.extractDomain(url);
    const [footprintWithDomain, uniqueFootprints] = await Promise.all([
      this.pageFootprintService.getFootprintsForDomains(domain),
      this.pageFootprintService.getUnusedFootprints(),
    ]);

    for (const footprint of [...footprintWithDomain, ...uniqueFootprints]) {
      if (new RegExp(footprint).test(url)) {
        return true;
      }
    }

    return false;
  }

  private updateProductPrice(
    productPrices: ProductPriceEntity[],
    body: SaveFavoriteProductRequest,
  ): ProductPriceEntity[] {
    const prices = [];

    return prices;
  }

  private updateProductSize(productSizes: ProductSizeEntity[], body: SaveFavoriteProductRequest): ProductSizeEntity[] {
    const sizes = [];

    return sizes;
  }

  private updateProductColor(
    productColors: ProductColorEntity[],
    body: SaveFavoriteProductRequest,
  ): ProductColorEntity[] {
    const colors = [];

    return colors;
  }

  public async updateProduct(product: ProductEntity, body: SaveFavoriteProductRequest): Promise<ProductEntity> {
    product.ean = body.ean ?? product.ean;
    product.title = body.title ?? product.title;
    product.image = body.image ?? product.image;
    product.currency = body.currency ?? product.currency;
    product.url = body.url ?? product.url;
    product.availability = body.availability ?? product.availability;
    product.image = body.image ?? product.image;

    const [prices, sizes, colors] = await Promise.all([
      this.productPriceRepository.findByProductId(product.id),
      this.productSizeRepository.findByProductId(product.id),
      this.productColorRepository.findByProductId(product.id),
    ]);

    product.prices = this.updateProductPrice(prices, body);
    product.sizes = this.updateProductSize(sizes, body);
    product.colors = this.updateProductColor(colors, body);

    return product;
  }

  public async createProduct(body: SaveFavoriteProductRequest): Promise<ProductEntity> {
    // TODO: Implement adding price, color and size in cases if passed

    return new ProductEntity(body.title, body.url, [], body.currency, body.availability, [], [], body.image, body.ean);
  }

  public async getDefaultCurrency(url: string): Promise<string> {
    const domain = URLHelper.extractDomain(url);
    const yamlSchema = await this.yamlSchemaRepository.findByDomain(domain);
    if (!yamlSchema) {
      this.logger.error(`No yaml schema found for domain: ${domain}`);

      return null;
    }

    return yamlSchema.defaultCurrency;
  }
}
