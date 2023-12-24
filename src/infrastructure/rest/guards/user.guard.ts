import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRequest } from '../../external/express/user.request';
import { isUUID } from 'class-validator';
import { UserRepository } from '../../database/repositories/users/user.repository';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: UserRequest = context.switchToHttp().getRequest();
    const userUuid = request.headers['user-uuid'];
    if (!userUuid) {
      throw new UnauthorizedException();
    }

    const uuid = userUuid.toString();
    if (!isUUID(uuid)) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findByUUID(uuid);
    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = {
      ...user,
      currentLocale: request.headers['cf-ipcountry']?.toString()?.toUpperCase() ?? null,
    };

    return true;
  }
}
