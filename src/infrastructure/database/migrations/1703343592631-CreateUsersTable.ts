import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { BrowserEnum } from '../../../domain/users/enums/browser.enum';

export class CreateUsersTable1703343592631 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'user_agent',
            type: 'varchar(255)',
          },
          {
            name: 'browser',
            type: 'enum',
            enum: Object.values(BrowserEnum),
          },
          {
            name: 'locale',
            type: 'varchar(2)',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
