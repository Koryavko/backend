import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Locale = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  try {
    const request = ctx.switchToHttp().getRequest();

    return request.headers['cf-ipcountry']?.toString()?.toUpperCase() ?? null;
  } catch (e) {
    return null;
  }
});
