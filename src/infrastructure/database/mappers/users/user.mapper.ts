import { EntitySchema } from 'typeorm';
import { BaseMapper } from '../base.mapper';
import { UserEntity } from '../../../../domain/users/entity/user.entity';
import { BrowserEnum } from '../../../../domain/users/enums/browser.enum';

export const UserMapper = new EntitySchema<UserEntity>({
  name: 'UserEntity',
  tableName: 'users',
  target: UserEntity,
  columns: {
    ...BaseMapper,
    uuid: {
      type: 'uuid',
      generated: 'uuid',
      nullable: false,
    },
    browser: {
      type: 'enum',
      enum: BrowserEnum,
      nullable: false,
    },
    userAgent: {
      type: String,
      length: 255,
      name: 'user_agent',
    },
    locale: {
      type: String,
      length: 2,
      nullable: true,
    },
  },
  orderBy: {
    id: 'ASC',
  },
  relations: {},
});
