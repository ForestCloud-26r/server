import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserDto } from '@app/shared/dtos';
import { CreateUserDto } from './dto/create-user.dto';
import { toUserDto } from '@app/shared/utils';
import { UserRoles } from '@app/shared/enums';
import { UserModel } from '../database/models/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const passwordHash = await this.generateHash(createUserDto.password);

    const createdUser = await this.usersRepository.create({
      ...createUserDto,
      password: passwordHash,
    });

    return toUserDto(createdUser);
  }

  public async findAllAdmins(): Promise<UserDto[]> {
    const users = await this.usersRepository.findAll({
      role: UserRoles.ADMIN,
    });

    return users.map((user) => toUserDto(user));
  }

  public async getUserByEmail(email: string): Promise<UserModel | null> {
    return await this.usersRepository.findOne({
      email,
    });
  }

  private async generateHash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(data, salt);
  }
}
