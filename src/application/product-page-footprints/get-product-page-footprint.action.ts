import { Injectable, Logger } from '@nestjs/common';
import { FootprintsResponse } from '../../presentation/responses/product-page-footprints/footprints.response';
import { ProductPageFootprintService } from '../../domain/product-page-footprints/services/product-page-footprint.service';

@Injectable()
export class GetProductPageFootprintAction {
  private readonly logger = new Logger(GetProductPageFootprintAction.name);

  constructor(private readonly pageFootprintService: ProductPageFootprintService) {}

  public async execute(domain: string): Promise<FootprintsResponse> {
    try {
      const [footprints, uniqueFootprints] = await Promise.all([
        this.pageFootprintService.getFootprintsForDomains(domain),
        this.pageFootprintService.getUnusedFootprints(),
      ]).catch((e) => {
        this.logger.error(`Error in receiving footprints. Message: ${e.message}`, e.stack);

        return [[], []];
      });

      return new FootprintsResponse(uniqueFootprints, footprints);
    } catch (e) {
      this.logger.error(`Error in receiving footprints. Message: ${e.message}`, e.stack);

      return new FootprintsResponse([], []);
    }
  }
}
