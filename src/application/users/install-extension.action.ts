import { Injectable } from '@nestjs/common';
import { BrowserEnum } from '../../domain/users/enums/browser.enum';
import { InstallExtensionResponse } from '../../presentation/responses/users/install-extension.response';
import { UserEntity } from '../../domain/users/entities/user.entity';
import { UserRepository } from '../../infrastructure/database/repositories/users/user.repository';
import { PlatformEnum } from '../../domain/users/enums/platform.enum';

@Injectable()
export class InstallExtensionAction {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(
    browser: BrowserEnum,
    locale: string,
    userAgent: string,
    platform: PlatformEnum,
  ): Promise<InstallExtensionResponse> {
    const user = new UserEntity(locale, userAgent, browser, platform);
    const userEntity = await this.userRepository.save(user);

    return new InstallExtensionResponse(userEntity.uuid);
  }
}
