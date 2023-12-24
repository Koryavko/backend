import { Body, Controller, Post, Req } from '@nestjs/common';
import { InstallExtensionRequest } from '../requests/users/install-extension.request';
import { ApiCreatedResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { InstallExtensionResponse } from '../responses/users/install-extension.response';
import { TooManyRequestsResponse, UnprocessableErrorResponse } from '../responses/response';
import { InstallExtensionAction } from '../../application/users/install-extension.action';
import { Request } from 'express';
import { Locale } from '../../infrastructure/decorators/locale.decorator';
import { ApiTooManyRequestsResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';

@Controller('users')
@ApiTags('users')
@ApiTooManyRequestsResponse({ type: TooManyRequestsResponse, description: 'Too many requests' })
export class UserController {
  constructor(private readonly installExtensionAction: InstallExtensionAction) {}

  @Post('installs')
  @ApiCreatedResponse({ description: 'The record has been successfully created', type: InstallExtensionResponse })
  @ApiOperation({ summary: `Method to get uuid and create a user` })
  @ApiUnprocessableEntityResponse({ type: UnprocessableErrorResponse, description: 'Validation error' })
  public async installExtension(
    @Body() body: InstallExtensionRequest,
    @Req() req: Request,
    @Locale() locale: string,
  ): Promise<InstallExtensionResponse> {
    const userAgent = req.headers['user-agent']?.toString() ?? null;

    return this.installExtensionAction.execute(body.browser, locale, userAgent, body.platform);
  }
}
