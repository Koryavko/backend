import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/rest/guards/jwt-auth.guard';
import { UserRequest } from '../../infrastructure/external/express/user.request';
import { UserGuard } from '../../infrastructure/rest/guards/user.guard';

@Controller('domains')
@UseGuards(JwtAuthGuard, UserGuard)
export class DomainController {
  @Get()
  public async getDomains(@Req() req: UserRequest): Promise<void> {
    console.log(req.user, 'user');
  }
}
