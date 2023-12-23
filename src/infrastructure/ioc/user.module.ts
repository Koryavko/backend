import { Module } from '@nestjs/common';
import { UserController } from '../../presentation/controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMapper } from '../database/mappers/users/user.mapper';
import { UserRepository } from '../database/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserMapper])],
  providers: [UserRepository],
  controllers: [UserController],
})
export class UserModule {}
