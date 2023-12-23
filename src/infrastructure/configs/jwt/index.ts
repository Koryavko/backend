import { JwtOptionsFactory } from '@nestjs/jwt';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';

export class JwtConfig implements JwtOptionsFactory {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    if (!this.configService.get('JWT_SECRET')) {
      throw new Error('JWT_SECRET is not defined');
    }
  }

  public createJwtOptions(): JwtModuleOptions {
    const expiresIn = this.configService.get('JWT_EXPIRES_IN');

    return {
      secret: this.configService.get('JWT_SECRET'),
      signOptions: {
        ...(expiresIn !== 'null' && { expiresIn }),
      },
    };
  }
}
