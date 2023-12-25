import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { ListNameEnum } from '../../../domain/sync-sheets/enums/list-name.enum';
import { ProcessStatusSyncEnum } from '../../../domain/sync-sheets/enums/process-status-sync.enum';

export class CreateGoogleSheetsTable1703527366146 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'google_sheets',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'link',
            type: 'varchar(2048)',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'enum',
            enum: Object.values(ListNameEnum),
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(ProcessStatusSyncEnum),
            isNullable: false,
          },
          {
            name: 'status_message',
            type: 'varchar(2048)',
            isNullable: true,
          },
          {
            name: 'count',
            type: 'int',
            default: 0,
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
      'google_sheets',
      new TableIndex({
        name: 'google_sheets_name_unique',
        isUnique: true,
        columnNames: ['name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('google_sheets');
  }
}
