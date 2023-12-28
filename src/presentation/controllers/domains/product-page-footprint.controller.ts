import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UserGuard } from '../../../infrastructure/rest/guards/user.guard';
import { AuthErrorResponse, TooManyRequestsResponse, UnprocessableErrorResponse } from '../../responses/response';
import { ApiTooManyRequestsResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { DomainInQueryRequest } from '../../requests/yaml-schemas/domain-in-query.request';
import { FootprintsResponse } from '../../responses/product-page-footprints/footprints.response';
import { GetProductPageFootprintAction } from '../../../application/product-page-footprints/get-product-page-footprint.action';

@Controller('domains')
@ApiBearerAuth()
@ApiTags('domains')
@UseGuards(UserGuard)
@ApiUnauthorizedResponse({ type: AuthErrorResponse, description: 'Unauthorized error' })
@ApiTooManyRequestsResponse({ type: TooManyRequestsResponse, description: 'Too many requests' })
export class ProductPageFootprintController {
  constructor(private readonly getProductPageFootprintAction: GetProductPageFootprintAction) {}

  @Get('product-page-footprints')
  @ApiOperation({ summary: `Obtaining a list of footprints to define product pages` })
  @ApiOkResponse({ description: 'Successfully obtained the list of footprints', type: FootprintsResponse })
  @ApiUnprocessableEntityResponse({ type: UnprocessableErrorResponse, description: 'Validation error' })
  public async getProductPageFootprints(@Query() query: DomainInQueryRequest): Promise<FootprintsResponse> {
    return this.getProductPageFootprintAction.execute(query.domain);
  }
}
