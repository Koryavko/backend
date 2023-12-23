import { Injectable } from '@nestjs/common';
import { BrowserEnum } from '../../domain/users/enums/browser.enum';
import { InstallExtensionResponse } from '../../presentation/responses/users/install-extension.response';
import { UserEntity } from '../../domain/users/entity/user.entity';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class InstallExtensionAction {
  constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService) {}

  public async execute(browser: BrowserEnum, locale: string, userAgent: string): Promise<InstallExtensionResponse> {
    const user = new UserEntity(locale, userAgent, browser);
    const userEntity = await this.userRepository.save(user);
    const token = await this.jwtService.signAsync({ id: userEntity.id });

    return new InstallExtensionResponse(userEntity.uuid, token);
  }
}
