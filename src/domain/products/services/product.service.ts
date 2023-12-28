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
import { DomainEntity } from '../../domains/entities/domain.entity';

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

  private updateProductSize(productSizes: ProductSizeEntity[], body: SaveFavoriteProductRequest): ProductSizeEntity[] {
    const sizes = [];

    for (const productSize of productSizes) {
      const find = body.sizes.find((item) => item.size.toLowerCase() === productSize.size.toLowerCase());
      productSize.availability = find ? find.availability : false;
      sizes.push(productSize);
    }

    for (const size of body.sizes) {
      const find = productSizes.find((item) => item.size.toLowerCase() === size.size.toLowerCase());
      if (!find) {
        sizes.push(new ProductSizeEntity(size.size, size.availability));
      }
    }

    return sizes;
  }

  private updateProductColor(
    productColors: ProductColorEntity[],
    body: SaveFavoriteProductRequest,
  ): ProductColorEntity[] {
    const colors = [];

    for (const productColor of productColors) {
      const find = body.colors.find((item) => item.color.toLowerCase() === productColor.color.toLowerCase());
      productColor.availability = find ? find.availability : false;
      colors.push(productColor);
    }

    for (const color of body.colors) {
      const find = productColors.find((item) => item.color.toLowerCase() === color.color.toLowerCase());
      if (!find) {
        colors.push(new ProductColorEntity(color.color, color.availability));
      }
    }

    return colors;
  }

  private updateProductPrice(
    productSizes: ProductPriceEntity[],
    body: SaveFavoriteProductRequest,
  ): ProductPriceEntity[] {
    const lastPrice = productSizes.length ? productSizes[productSizes.length - 1] : null;
    const checkPrice = Number(lastPrice.price) !== Number(body.price ?? 0);
    const checkCurrency = lastPrice.currency.toLowerCase() !== body.currency.toLowerCase();

    if (!lastPrice || checkPrice || checkCurrency) {
      productSizes.push(new ProductPriceEntity(body.price, currency));
    }

    return productSizes;
  }

  public async updateProduct(product: ProductEntity, body: SaveFavoriteProductRequest): Promise<ProductEntity> {
    product.ean = body.ean ?? product.ean;
    product.title = body.title ?? product.title;
    product.image = body.image ?? product.image;
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

  public async createProduct(body: SaveFavoriteProductRequest, domain: DomainEntity): Promise<ProductEntity> {
    const prices = new ProductPriceEntity(body.price, body.currency);
    const sizes = body.sizes.map((item) => new ProductSizeEntity(item.size, item.availability));
    const colors = body.colors.map((item) => new ProductColorEntity(item.color, item.availability));

    return new ProductEntity(
      domain,
      body.title,
      body.url,
      [prices],
      body.availability,
      colors,
      sizes,
      body.image,
      body.ean,
    );
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
