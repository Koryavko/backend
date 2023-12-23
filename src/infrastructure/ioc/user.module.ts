import { Module } from '@nestjs/common';
import { UserController } from '../../presentation/controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMapper } from '../database/mappers/users/user.mapper';
import { UserRepository } from '../database/repositories/user.repository';
import { InstallExtensionAction } from '../../application/users/install-extension.action';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from '../configs/jwt';
import { JwtStrategy } from '../../domain/users/strategies/jwt.startegy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserMapper]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useClass: JwtConfig,
    }),
  ],
  providers: [UserRepository, InstallExtensionAction, JwtStrategy],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
