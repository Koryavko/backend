import { ListNameEnum } from '../enums/list-name.enum';
import { ProcessStatusSyncEnum } from '../enums/process-status-sync.enum';

export class GoogleSheetEntity {
  public id: number;

  public link: string;

  public name: ListNameEnum;

  public status: ProcessStatusSyncEnum;

  public statusMessage: string;

  public count: number;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(
    id: number,
    link: string,
    name: ListNameEnum,
    status: ProcessStatusSyncEnum,
    statusMessage: string,
    count: number,
  ) {
    this.id = id;
    this.link = link;
    this.name = name;
    this.status = status;
    this.statusMessage = statusMessage;
    this.count = count;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
