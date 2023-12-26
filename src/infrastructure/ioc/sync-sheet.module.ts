import { Module } from '@nestjs/common';
import { GoogleSheetRepository } from '../database/repositories/sync-sheets/google-sheet.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleSheetMapper } from '../database/mappers/sync-sheets/google-sheet.mapper';
import { SyncController } from '../../presentation/controllers/sync.controller';
import { UserModule } from './user.module';
import { DomainModule } from './domain.module';
import { SyncSheetAction } from '../../application/sync/sync-sheet.action';
import { BullModule } from '@nestjs/bull';
import { SYNC_SHEET_QUEUE } from '../constants/queue.constant';
import { SyncConsumer } from '../../domain/sync-sheets/consumers/sync.consumer';
import { SyncService } from '../../domain/sync-sheets/services/sync.service';
import { GoogleSheetService } from '../external/modules/google-sheets/services/google-sheet.service';
import { ProductPageFootprintModule } from './product-page-footprint.module';
import { SyncProductPageFootprintsService } from '../../domain/sync-sheets/services/sync-product-page-footprints.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GoogleSheetMapper]),
    BullModule.registerQueue({
      name: SYNC_SHEET_QUEUE,
    }),
    UserModule,
    DomainModule,
    ProductPageFootprintModule,
  ],
  controllers: [SyncController],
  providers: [
    GoogleSheetRepository,
    SyncSheetAction,
    SyncConsumer,
    SyncService,
    GoogleSheetService,
    SyncProductPageFootprintsService,
  ],
})
export class SyncSheetModule {}
