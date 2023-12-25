import { EntitySchema } from 'typeorm';
import { BaseMapper } from '../base.mapper';
import { GoogleSheetEntity } from '../../../../domain/sync-sheets/enities/google-sheet.entity';
import { ProcessStatusSyncEnum } from '../../../../domain/sync-sheets/enums/process-status-sync.enum';
import { ListNameEnum } from '../../../../domain/sync-sheets/enums/list-name.enum';

export const GoogleSheetMapper = new EntitySchema<GoogleSheetEntity>({
  name: 'GoogleSheetEntity',
  tableName: 'google_sheets',
  target: GoogleSheetEntity,
  columns: {
    ...BaseMapper,
    link: {
      name: 'link',
      type: String,
      length: 2048,
      nullable: false,
    },
    name: {
      name: 'name',
      type: 'enum',
      enum: ListNameEnum,
      nullable: false,
    },
    status: {
      name: 'status',
      type: 'enum',
      enum: ProcessStatusSyncEnum,
      nullable: false,
    },
    statusMessage: {
      name: 'status_message',
      type: String,
      nullable: true,
    },
    count: {
      name: 'count',
      type: Number,
      nullable: false,
      default: 0,
    },
  },
  orderBy: {
    id: 'ASC',
  },
  relations: {},
});
