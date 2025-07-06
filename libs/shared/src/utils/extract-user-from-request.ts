import { UserPayloadDto } from '@app/shared/dtos';

export const extractUserFromRequest = (
  request: Express.Request,
): UserPayloadDto => {
  return request.user as UserPayloadDto;
};
