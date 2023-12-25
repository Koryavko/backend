import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateYamlSchemasTable1703494956986 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'yaml_schemas',
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
            name: 'title',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'image',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'color',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'currency',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'default_currency',
            type: 'varchar(36)',
            isNullable: false,
          },
          {
            name: 'size',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'availability',
            type: 'jsonb',
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

    await queryRunner.createIndex(
      'yaml_schemas',
      new TableIndex({
        name: 'users_domain_name_unique',
        isUnique: true,
        columnNames: ['domain_name'],
      }),
    );

    await queryRunner.createIndex(
      'yaml_schemas',
      new TableIndex({
        name: 'users_domain_id_unique',
        isUnique: true,
        columnNames: ['domain_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('yaml_schemas');
  }
}
