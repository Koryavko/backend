import { ProductEntity } from './product.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { NotificationFeatureEnum } from '../enums/notification-feature.enum';

export class ProductFavoriteEntity {
  public id: number;

  public product: ProductEntity;

  public user: UserEntity;

  public isDone: boolean;

  public viewedAt: Date;

  public notificationFeature: NotificationFeatureEnum;

  public notificationSize: string;

  public notificationColor: string;

  public notificationPrice: number;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(
    product: ProductEntity,
    user: UserEntity,
    isDone: boolean,
    viewedAt: Date,
    notificationFeature: NotificationFeatureEnum,
    notificationSize: string,
    notificationColor: string,
    notificationPrice: number,
  ) {
    this.product = product;
    this.user = user;
    this.isDone = isDone;
    this.viewedAt = viewedAt;
    this.notificationFeature = notificationFeature;
    this.notificationSize = notificationSize;
    this.notificationColor = notificationColor;
    this.notificationPrice = notificationPrice;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
