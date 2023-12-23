import { Body, Controller, Post, Req } from '@nestjs/common';
import { InstallExtensionRequest } from '../requests/users/install-extension.request';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { InstallExtensionResponse } from '../responses/users/install-extension.response';
import { AuthErrorResponse, UnprocessableErrorResponse } from '../responses/response';
import { InstallExtensionAction } from '../../application/users/install-extension.action';
import { Request } from 'express';
import { Locale } from '../../infrastructure/decorators/locale.decorator';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly installExtensionAction: InstallExtensionAction) {}

  @Post('installs')
  @ApiCreatedResponse({ description: 'The record has been successfully created', type: InstallExtensionResponse })
  @ApiOperation({
    summary: `Get coupons by domain, rate limit: 1000req per 3600sec`,
  })
  @Throttle({ default: { ttl: 3600, limit: 1000 } })
  @ApiUnauthorizedResponse({ type: AuthErrorResponse, description: 'Unauthorized error' })
  @ApiUnprocessableEntityResponse({ type: UnprocessableErrorResponse, description: 'Validation error' })
  public async installExtension(
    @Body() body: InstallExtensionRequest,
    @Req() req: Request,
    @Locale() locale: string,
  ): Promise<InstallExtensionResponse> {
    const userAgent = req.headers['user-agent']?.toString() ?? null;

    return this.installExtensionAction.execute(body.browser, locale, userAgent);
  }
}
