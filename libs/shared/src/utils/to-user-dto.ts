import { UserModel } from '../../../../src/database/models/user.model';
import { UserDto } from '@app/shared/dtos';
import { plainToInstance } from 'class-transformer';

export const toUserDto = (userModel: UserModel): UserDto => {
  const plainModel = userModel.get({ plain: true });

  return plainToInstance(UserDto, plainModel, {
    excludeExtraneousValues: true,
  });
};
