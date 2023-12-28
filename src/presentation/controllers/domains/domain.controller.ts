import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserRequest } from '../../../infrastructure/external/modules/express/user.request';
import { UserGuard } from '../../../infrastructure/rest/guards/user.guard';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthErrorResponse, TooManyRequestsResponse } from '../../responses/response';
import { ApiTooManyRequestsResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { GetPopularDomainsResponse } from '../../responses/domains/get-popular-domains.response';
import { GetPopularDomainsAction } from '../../../application/domains/get-popular-domains.action';
import { GetDomainListResponse } from '../../responses/domains/get-domain-list.response';
import { GetDomainListAction } from '../../../application/domains/get-domain-list.action';

@Controller('domains')
@ApiBearerAuth()
@ApiTags('domains')
@UseGuards(UserGuard)
@ApiUnauthorizedResponse({ type: AuthErrorResponse, description: 'Unauthorized error' })
@ApiTooManyRequestsResponse({ type: TooManyRequestsResponse, description: 'Too many requests' })
export class DomainController {
  constructor(
    private readonly getPopularDomainsAction: GetPopularDomainsAction,
    private readonly getDomainListAction: GetDomainListAction,
  ) {}

  @Get('populars')
  @ApiOperation({ summary: `Getting a list of popular domains` })
  @ApiOkResponse({ description: 'Successfully obtained the list of popular domains', type: GetPopularDomainsResponse })
  public async getPopularDomains(@Req() req: UserRequest): Promise<GetPopularDomainsResponse> {
    return this.getPopularDomainsAction.execute(req.user.currentLocale);
  }

  @Get('domain-list')
  @ApiOperation({ summary: `Getting a list of domains` })
  @ApiOkResponse({ description: 'Successfully obtained the list of domains', type: GetDomainListResponse })
  public async getDomains(): Promise<GetDomainListResponse> {
    return this.getDomainListAction.execute();
  }
}
