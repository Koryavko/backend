import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';
import { NotificationFeatureEnum } from '../../../domain/products/enums/notification-feature.enum';

export class CreateProductFavoritesTable1703679416620 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product_favorites',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'product_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'is_done',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'viewed_at',
            type: 'timestamp with time zone',
            default: null,
            isNullable: true,
          },
          {
            name: 'notification_feature',
            type: 'enum',
            enum: Object.values(NotificationFeatureEnum),
            isNullable: false,
          },
          {
            name: 'notification_size',
            type: 'varchar(255)',
            isNullable: true,
          },
          {
            name: 'notification_color',
            type: 'varchar(255)',
            isNullable: true,
          },
          {
            name: 'notification_price',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp with time zone',
            default: null,
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'product_favorites',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
      }),
    );

    await queryRunner.createForeignKey(
      'product_favorites',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    );

    await queryRunner.createIndex(
      'product_favorites',
      new TableIndex({
        name: 'product_favorites_product_id_index',
        columnNames: ['product_id'],
      }),
    );

    await queryRunner.createIndex(
      'product_favorites',
      new TableIndex({
        name: 'product_favorites_user_id_index',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'product_favorites',
      new TableIndex({
        name: 'product_favorites_is_done_index',
        columnNames: ['is_done'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product_favorites');
  }
}
