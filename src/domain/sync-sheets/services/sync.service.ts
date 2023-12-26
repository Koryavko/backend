import { Injectable } from '@nestjs/common';
import { GoogleSheetRepository } from '../../../infrastructure/database/repositories/sync-sheets/google-sheet.repository';
import { GoogleSheetEntity } from '../enities/google-sheet.entity';
import { GoogleSheetService } from '../../../infrastructure/external/modules/google-sheets/services/google-sheet.service';
import { URLHelper } from '../../utillity/helpers/url.helper';
import { ProcessStatusSyncEnum } from '../enums/process-status-sync.enum';
import { ListNameEnum } from '../enums/list-name.enum';
import { SyncProductPageFootprintsService } from './sync-product-page-footprints.service';

@Injectable()
export class SyncService {
  constructor(
    private readonly googleSheetRepository: GoogleSheetRepository,
    private readonly googleSheetService: GoogleSheetService,
    private readonly syncProductPageFootprintsService: SyncProductPageFootprintsService,
  ) {}

  private async getSheet(id: number): Promise<GoogleSheetEntity> {
    const googleSheetEntity = await this.googleSheetRepository.findById(id);
    if (!googleSheetEntity) {
      throw new Error('Sheet not found');
    }

    if (googleSheetEntity.status !== ProcessStatusSyncEnum.PROCESSING) {
      throw new Error('The sheet is not processing');
    }

    return googleSheetEntity;
  }

  private async syncListName(name: ListNameEnum, data: string[][]): Promise<number> {
    switch (true) {
      case name === ListNameEnum.PRODUCT_PAGE_FOOTPRINTS:
        return this.syncProductPageFootprintsService.sync(data);
      default:
        return 0;
    }
  }

  private async prepareData(link: string): Promise<string[][]> {
    const data = await this.googleSheetService.execute(link);

    return data
      .slice(1)
      .map((row) => {
        if (!row[0]) {
          return [null, row[1]];
        }

        return [URLHelper.extractDomain(row[0]?.trim()), row[1].trim()];
      })
      .filter(Boolean);
  }

  public async sync(id: number): Promise<void> {
    const sheetEntity = await this.getSheet(id);
    const data = await this.prepareData(sheetEntity.link);

    sheetEntity.count = await this.syncListName(sheetEntity.name, data);
    sheetEntity.status = ProcessStatusSyncEnum.DONE;

    await this.googleSheetRepository.save(sheetEntity);
  }
}
