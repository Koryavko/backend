import { Request } from 'express';
import { UserEntity } from '../../../../domain/users/entity/user.entity';

export interface UserRequest extends Request {
  user: UserEntity;
}
