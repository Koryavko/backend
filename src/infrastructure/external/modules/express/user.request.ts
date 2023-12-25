import { Request } from 'express';
import { UserEntity } from '../../../../domain/users/entities/user.entity';

export interface UserRequest extends Request {
  user: UserEntity;
}
