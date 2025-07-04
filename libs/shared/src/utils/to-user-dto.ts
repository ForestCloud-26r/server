import { UserModel } from '../../../../src/database/models/user.model';
import { UserDto } from '@app/shared/dtos';
import { plainToInstance } from 'class-transformer';

export const toUserDto = (userModel: UserModel): UserDto => {
  return plainToInstance(UserDto, userModel, {
    excludeExtraneousValues: true,
  });
};
