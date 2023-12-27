import { EntitySchema } from 'typeorm';
import { BaseMapper } from '../base.mapper';
import { ProductFavoriteEntity } from '../../../../domain/products/entities/product-favorite.entity';
import { NotificationFeatureEnum } from '../../../../domain/products/enums/notification-feature.enum';

export const ProductFavoriteMapper = new EntitySchema<ProductFavoriteEntity>({
  name: 'ProductFavoriteEntity',
  tableName: 'product_favorites',
  target: ProductFavoriteEntity,
  columns: {
    ...BaseMapper,
    isDone: {
      name: 'is_done',
      type: Boolean,
      default: false,
      nullable: false,
    },
    viewedAt: {
      name: 'viewed_at',
      type: 'timestamp with time zone',
      default: null,
      nullable: true,
    },
    notificationFeature: {
      name: 'notification_feature',
      type: 'enum',
      enum: Object.values(NotificationFeatureEnum),
      nullable: false,
    },
    notificationSize: {
      name: 'notification_size',
      type: String,
      length: 255,
      nullable: true,
    },
    notificationColor: {
      name: 'notification_color',
      type: String,
      length: 255,
      nullable: true,
    },
    notificationPrice: {
      name: 'notification_price',
      type: Number,
      nullable: true,
    },
  },
  orderBy: {
    id: 'ASC',
  },
  relations: {
    product: {
      type: 'many-to-one',
      target: 'ProductEntity',
      joinColumn: {
        name: 'product_id',
      },
    },
    user: {
      type: 'many-to-one',
      target: 'UserEntity',
      joinColumn: {
        name: 'user_id',
      },
    },
  },
});
