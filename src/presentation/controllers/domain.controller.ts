import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/rest/guards/jwt-auth.guard';
import { UserRequest } from '../../infrastructure/external/express/user.request';
import { UserGuard } from '../../infrastructure/rest/guards/user.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('domains')
@ApiBearerAuth()
@ApiTags('domains')
@UseGuards(JwtAuthGuard, UserGuard)
export class DomainController {
  @Get()
  public async getDomains(@Req() req: UserRequest): Promise<any> {
    return req.user;
  }
}
