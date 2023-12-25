import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../domain/users/entities/user.entity';
import { UserMapper } from '../../mappers/users/user.mapper';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserMapper)
    repository: Repository<UserEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async findByUUID(uuid: string): Promise<UserEntity> {
    return this.findOneBy({ uuid });
  }
}
