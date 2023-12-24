import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { DomainTypeEnum } from '../../../domain/domains/enums/domain-type.enum';

export class CreateTableWithDomains1703418249236 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'domains',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'domain',
            type: 'varchar(255)',
            isNullable: false,
          },
          {
            name: 'main_page',
            type: 'varchar(255)',
            isNullable: false,
          },
          {
            name: 'logo',
            type: 'varchar(2048)',
            isNullable: false,
          },
          {
            name: 'rating',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: Object.values(DomainTypeEnum),
            isNullable: false,
            default: `'${DomainTypeEnum.WORLD}'`,
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
      'domains',
      new TableIndex({
        name: 'users_domain_unique',
        isUnique: true,
        columnNames: ['domain'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('domains');
  }
}
