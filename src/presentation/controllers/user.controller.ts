import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserRequest } from '../../infrastructure/external/express/user.request';
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

@Controller('users')
@ApiTags('users')
// @UseGuards(AuthGuard)
export class UserController {
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
    @Req() req: UserRequest,
  ): Promise<InstallExtensionResponse | any> {
    console.log(req.user);
  }
}
