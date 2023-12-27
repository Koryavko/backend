import { Injectable } from '@nestjs/common';
import { ProductEntity } from '../entities/product.entity';
import { SaveFavoriteProductRequest } from '../../../presentation/requests/products/save-favorite-product.request';
import { UserEntity } from '../../users/entities/user.entity';
import { ProductFavoriteEntity } from '../entities/product-favorite.entity';
import { ProductFavoriteRepository } from '../../../infrastructure/database/repositories/products/product-favorite.repository';
import { NotificationFeatureEnum } from '../enums/notification-feature.enum';

@Injectable()
export class ProductFavoriteService {
  constructor(private readonly productFavoriteRepository: ProductFavoriteRepository) {}

  public async saveFavorites(
    product: ProductEntity,
    user: UserEntity,
    body: SaveFavoriteProductRequest,
  ): Promise<void> {
    const favorite = new ProductFavoriteEntity(product, user, false, null, body.feature, null, null, null);

    if (body.feature === NotificationFeatureEnum.SIZE && body.notifySize) {
      favorite.notificationSize = body.notifySize;
    } else if (body.feature === NotificationFeatureEnum.COLOR && body.notifyColor) {
      favorite.notificationColor = body.notifyColor;
    } else if (body.feature === NotificationFeatureEnum.PRICE && body.notifyPrice) {
      favorite.notificationPrice = body.notifyPrice;
    }

    await this.productFavoriteRepository.save(favorite);
  }
}
