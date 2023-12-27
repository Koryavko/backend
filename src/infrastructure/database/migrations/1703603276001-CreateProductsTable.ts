import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateProductsTable1703603276001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar(1024)',
            isNullable: true,
          },
          {
            name: 'url',
            type: 'varchar(2048)',
            isNullable: false,
          },
          {
            name: 'availability',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'image',
            type: 'varchar(2048)',
            isNullable: true,
          },
          {
            name: 'ean',
            type: 'varchar(255)',
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

    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'users_product_url_unique',
        isUnique: true,
        columnNames: ['url'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
