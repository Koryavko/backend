import { Module } from '@nestjs/common';
import { UserController } from '../../presentation/controllers/users/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMapper } from '../database/mappers/users/user.mapper';
import { UserRepository } from '../database/repositories/users/user.repository';
import { InstallExtensionAction } from '../../application/users/install-extension.action';

@Module({
  imports: [TypeOrmModule.forFeature([UserMapper])],
  providers: [UserRepository, InstallExtensionAction],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {}
