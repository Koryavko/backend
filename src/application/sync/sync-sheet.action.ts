import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ListNameEnum } from '../../domain/sync-sheets/enums/list-name.enum';
import { GoogleSheetRepository } from '../../infrastructure/database/repositories/sync-sheets/google-sheet.repository';
import { ProcessStatusSyncEnum } from '../../domain/sync-sheets/enums/process-status-sync.enum';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SYNC_SHEET_QUEUE } from '../../infrastructure/constants/queue.constant';

@Injectable()
export class SyncSheetAction {
  private readonly logger = new Logger(SyncSheetAction.name);

  constructor(
    private readonly googleSheetRepository: GoogleSheetRepository,
    @InjectQueue(SYNC_SHEET_QUEUE) private syncQueue: Queue,
  ) {}

  public async execute(listName: ListNameEnum): Promise<void> {
    const googleSheetEntity = await this.googleSheetRepository.findSheetByListName(listName).catch((e) => {
      this.logger.error(`Error finding sheet by list name: ${listName}`, e.stack);

      return null;
    });
    if (!googleSheetEntity) {
      throw new NotFoundException('The sheet was not found');
    }

    if (googleSheetEntity.status === ProcessStatusSyncEnum.PROCESSING) {
      throw new ConflictException('The process is already running');
    }

    // await this.googleSheetRepository.setStatus(googleSheetEntity.id, ProcessStatusSyncEnum.PROCESSING);
    await this.syncQueue.add(
      { id: googleSheetEntity.id },
      { attempts: 1, backoff: 0, removeOnComplete: true, removeOnFail: true },
    );
  }
}
