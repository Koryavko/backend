import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateDomainImportantQueryParamsTable1703621170272 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'domain_important_query_params',
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
            isNullable: false,
          },
          {
            name: 'domain_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'params',
            type: 'varchar(1028)',
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
      'domain_important_query_params',
      new TableForeignKey({
        columnNames: ['domain_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'domains',
      }),
    );

    await queryRunner.createIndex(
      'domain_important_query_params',
      new TableIndex({
        name: 'domain_important_query_params_domain_id_index',
        columnNames: ['domain_id'],
      }),
    );

    await queryRunner.createIndex(
      'domain_important_query_params',
      new TableIndex({
        name: 'domain_important_query_params_domain_name_index',
        columnNames: ['domain_name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('domain_important_query_params');
  }
}
