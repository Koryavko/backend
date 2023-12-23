import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRequest } from '../../external/express/user.request';

@Injectable()
export class UserGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as UserRequest;

    return Boolean(request.user);
  }
}
