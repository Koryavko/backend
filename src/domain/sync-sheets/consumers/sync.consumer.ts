import {
  OnQueueActive,
  OnQueueCleaned,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueStalled,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { SYNC_SHEET_QUEUE } from '../../../infrastructure/constants/queue.constant';
import { GoogleSheetRepository } from '../../../infrastructure/database/repositories/sync-sheets/google-sheet.repository';
import { SyncService } from '../services/sync.service';

@Processor(SYNC_SHEET_QUEUE)
export class SyncConsumer {
  private readonly logger = new Logger(SyncConsumer.name);

  constructor(
    private readonly googleSheetRepository: GoogleSheetRepository,
    private readonly syncService: SyncService,
  ) {}

  @OnQueueActive()
  public onActive(job: Job<{ id: number }>): void {
    this.logger.warn(`Processing job ${job.id} of type ${job.name}...`);
  }

  @OnQueueCompleted()
  public onCompleted(job: Job<{ id: number }>): void {
    this.logger.warn(`Finished processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public async onFailed(job: Job<{ id: number }>, error: Error): Promise<void> {
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
    await this.googleSheetRepository.updateStatusMessage(job.data.id, error.message);
  }

  @OnQueueStalled()
  public async onStall(job: Job<{ id: number }>): Promise<void> {
    this.logger.warn(`Stalled job ${job.id} of type ${job.name}`);
  }

  @OnQueueCleaned()
  public async onCleaned(): Promise<void> {
    this.logger.warn(`Queue is cleaned`);
  }

  @Process()
  public async extract(job: Job<{ id: number }>): Promise<void> {
    console.log('sync consumer');

    return this.syncService.sync(job.data.id);
  }
}
