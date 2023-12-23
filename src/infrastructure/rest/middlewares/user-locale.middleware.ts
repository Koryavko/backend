import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { UserRequest } from '../../external/express/user.request';

@Injectable()
export class UserLocaleMiddleware implements NestMiddleware {
  public use(req: UserRequest, res: Response, next: NextFunction): void {
    if (!req.headers['cf-ipcountry']) {
      req.locale = null;

      return next();
    }

    req.locale = req.headers['cf-ipcountry'].toString().toUpperCase();
    next();
  }
}
