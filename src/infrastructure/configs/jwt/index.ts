import { JwtOptionsFactory } from '@nestjs/jwt';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';

export class JwtConfig implements JwtOptionsFactory {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    if (!this.configService.get('JWT_SECRET')) {
      throw new Error('JWT_SECRET is not defined');
    }

    // if(!this.configService.get('JWT_EXPIRES_IN')){
    //   throw new Error('JWT_EXPIRES_IN is not defined');
    // }
  }

  public createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get('JWT_SECRET'),
      signOptions: {
        // expiresIn:this.configService.get('JWT_EXPIRES_IN')
      },
    };
  }
}
