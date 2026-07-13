import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface RequestUser {
  sub: number;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RequestUser | undefined => {
    const request = context.switchToHttp().getRequest();
    return request.user as RequestUser | undefined;
  },
);
