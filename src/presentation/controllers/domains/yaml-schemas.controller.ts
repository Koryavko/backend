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
import { GetProductParseRulesResponse } from '../../responses/yaml-schemas/get-product-parse-rules.response';
import { DomainInQueryRequest } from '../../requests/yaml-schemas/domain-in-query.request';
import { GetProductParseRulesAction } from '../../../application/yaml-schemas/get-product-parse-rules.action';

@Controller('domains')
@ApiBearerAuth()
@ApiTags('domains')
@UseGuards(UserGuard)
@ApiUnauthorizedResponse({ type: AuthErrorResponse, description: 'Unauthorized error' })
@ApiTooManyRequestsResponse({ type: TooManyRequestsResponse, description: 'Too many requests' })
export class YamlSchemasController {
  constructor(private readonly getProductParseRulesAction: GetProductParseRulesAction) {}

  @Get('product-parse-rules')
  @ApiOperation({ summary: `Getting a list of yaml schemas` })
  @ApiOkResponse({ description: 'Successfully obtained the list of yaml schemas', type: GetProductParseRulesResponse })
  @ApiUnprocessableEntityResponse({ type: UnprocessableErrorResponse, description: 'Validation error' })
  public async getYamlSchemas(@Query() query: DomainInQueryRequest): Promise<GetProductParseRulesResponse> {
    return this.getProductParseRulesAction.execute(query.domain);
  }
}
