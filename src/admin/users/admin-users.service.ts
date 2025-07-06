import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from '@app/shared/dtos';
import { UsersRepository } from '../../users/users.repository';
import { toUserDto } from '@app/shared/utils';

@Injectable()
export class AdminUsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async giveUserAccess(userId: string): Promise<UserDto> {
    const updatedUser = await this.usersRepository.giveAccess(userId);

    if (!updatedUser) {
      throw new NotFoundException();
    }

    return toUserDto(updatedUser);
  }
}
