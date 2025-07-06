import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayloadDto } from '@app/shared/dtos';
import { plainToInstance } from 'class-transformer';
import { extractUserFromRequest } from '@app/shared/utils';

export const User = createParamDecorator(
  (data: keyof UserPayloadDto, context: ExecutionContext) => {
    const request: Express.Request = context.switchToHttp().getRequest();
    const user = extractUserFromRequest(request);

    if (data) {
      return user[data];
    }

    return plainToInstance(UserPayloadDto, user, {
      excludeExtraneousValues: true,
    });
  },
);
