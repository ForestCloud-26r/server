import { AbstractRepository } from 'nest-sequelize-repository';
import { UserModel } from '../../database/models/user.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserRoles } from '@app/shared/enums';

@Injectable()
export class AdminUserRepository extends AbstractRepository<UserModel> {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
  ) {
    super(userModel, {
      autoGenerateId: true,
      idField: 'userId',
    });
  }

  public async giveAccess(userId: string): Promise<UserModel> {
    const updatedUser = await this.updateByPk(userId, {
      hasAccess: true,
    });

    if (!updatedUser) {
      throw new NotFoundException();
    }

    return updatedUser;
  }

  public async restrictAccess(userId: string): Promise<UserModel> {
    const updatedUser = await this.updateByPk(userId, {
      hasAccess: false,
    });

    if (!updatedUser) {
      throw new NotFoundException();
    }

    return updatedUser;
  }

  public async deleteUser(userId: string): Promise<UserModel> {
    const deletedUser = await this.deleteByPk(userId);

    if (!deletedUser) {
      throw new NotFoundException();
    }

    return deletedUser;
  }

  public async changeRole(userId: string, role: UserRoles): Promise<UserModel> {
    const updatedUser = await this.updateByPk(userId, {
      role,
    });

    if (!updatedUser) {
      throw new NotFoundException();
    }

    return updatedUser;
  }
}
