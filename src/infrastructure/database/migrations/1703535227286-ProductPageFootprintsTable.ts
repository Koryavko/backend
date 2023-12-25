import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class ProductPageFootprintsTable1703535227286 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product_page_footprints',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'domain_name',
            type: 'varchar(255)',
            isNullable: true,
          },
          {
            name: 'domain_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'footprint',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'is_synced',
            type: 'boolean',
            default: true,
            isNullable: false,
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
      'product_page_footprints',
      new TableForeignKey({
        columnNames: ['domain_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'domains',
      }),
    );

    await queryRunner.createIndex(
      'product_page_footprints',
      new TableIndex({
        name: 'product_page_footprints_domain_name',
        columnNames: ['domain_name'],
      }),
    );
    await queryRunner.createIndex(
      'product_page_footprints',
      new TableIndex({
        name: 'product_page_footprints_domain_id',
        columnNames: ['domain_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product_page_footprints');
  }
}
