import { Injectable } from '@nestjs/common';
import { GoogleSheetRepository } from '../../../infrastructure/database/repositories/sync-sheets/google-sheet.repository';
import { GoogleSheetEntity } from '../enities/google-sheet.entity';
import { GoogleSheetService } from '../../../infrastructure/external/modules/google-sheets/services/google-sheet.service';
import { URLHelper } from '../../utillity/helpers/url.helper';
import { DomainRepository } from '../../../infrastructure/database/repositories/domains/domain.repository';
import { ProductPageFootprintRepository } from '../../../infrastructure/database/repositories/product-page-footprints/product-page-footprint.repository';
import { ProductPageFootprintDto } from '../../product-page-footprints/dto/product-page-footprint.dto';
import { ProductPageFootprintEntity } from '../../product-page-footprints/entities/product-page-footprint.entity';

@Injectable()
export class SyncService {
  private readonly example = [
    ['Domain', 'Footprints'],
    [
      'amazon.de',
      'http(s)?:\\/\\/(www\\.|\\/\\/)?amazon(\\.[a-z]{2,3}){1,2}\\/(.*\\/)?(dp|gp)(\\/product)?\\/\\w{10}(\\/?(\\?.*|\\/.*))?$',
    ],
    [
      'www.amazon.de',
      'http(s)?:\\/\\/(www\\.|\\/\\/)?amazon(\\.[a-z]{2,3}){1,2}\\/(.*\\/)?(dp|gp)(\\/product)?\\/\\w{10}(\\/?(\\?.*|\\/.*))?$',
    ],
  ];

  constructor(
    private readonly googleSheetRepository: GoogleSheetRepository,
    private readonly googleSheetService: GoogleSheetService,
    private readonly domainRepository: DomainRepository,
    private readonly productPageFootprintRepository: ProductPageFootprintRepository,
  ) {}

  private async getSheet(id: number): Promise<GoogleSheetEntity> {
    const googleSheetEntity = await this.googleSheetRepository.findById(id);
    if (!googleSheetEntity) {
      throw new Error('Sheet not found');
    }

    // if(googleSheetEntity.status !== ProcessStatusSyncEnum.PROCESSING){
    //   throw new Error('The sheet is not processing');
    // }

    return googleSheetEntity;
  }

  private async saveProductPageFootprints(data: string[][]): Promise<void> {
    await this.productPageFootprintRepository.setAllUnSynced();

    for (let i = 0; i < data.length; i++) {
      const [domain, footprint] = data[i];
      if (!footprint) {
        continue;
      }

      const productPageFootprintDto = new ProductPageFootprintDto(domain, footprint, i);
      const validationResponse = await productPageFootprintDto.validate();
      if (validationResponse.error) {
        continue;
      }

      let domainEntity;
      try {
        if (domain) {
          domainEntity = await this.domainRepository.findOneByDomain(domain);
        }

        const productPageFootprintEntity = new ProductPageFootprintEntity(domain, domainEntity, footprint, true);
        await this.productPageFootprintRepository.createProductPageFootprint(productPageFootprintEntity);
      } catch (e) {}

      await this.productPageFootprintRepository.deleteAllUnSynced();
    }
  }

  public async sync(id: number): Promise<void> {
    const sheetEntity = await this.getSheet(id);
    // const data = await this.googleSheetService.execute(sheetEntity.link);
    let data = this.example;
    data = data
      .slice(1)
      .map((row) => [URLHelper.extractDomain(row[0].trim()), row[1].trim()])
      .filter(Boolean);
  }
}
