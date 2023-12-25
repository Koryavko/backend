import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleSheetEntity } from '../../../../domain/sync-sheets/enities/google-sheet.entity';
import { GoogleSheetMapper } from '../../mappers/sync-sheets/google-sheet.mapper';
import { ListNameEnum } from '../../../../domain/sync-sheets/enums/list-name.enum';
import { ProcessStatusSyncEnum } from '../../../../domain/sync-sheets/enums/process-status-sync.enum';

@Injectable()
export class GoogleSheetRepository extends Repository<GoogleSheetEntity> {
  constructor(
    @InjectRepository(GoogleSheetMapper)
    repository: Repository<GoogleSheetEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async findSheetByListName(listName: ListNameEnum): Promise<GoogleSheetEntity> {
    return this.findOneBy({ name: listName });
  }

  public async setStatus(id: number, status: ProcessStatusSyncEnum): Promise<void> {
    await this.update(id, { status });
  }

  public async updateStatusMessage(id: number, message: string): Promise<void> {
    await this.update(id, { statusMessage: message, status: ProcessStatusSyncEnum.ERROR });
  }

  public async findById(id: number): Promise<GoogleSheetEntity> {
    return this.findOneBy({ id });
  }
}
