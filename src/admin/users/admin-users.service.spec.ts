import { Test, TestingModule } from '@nestjs/testing';
import { AdminUsersService } from './admin-users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '../../database/models/user.model';
import { Sequelize } from 'sequelize-typescript';
import { UsersRepository } from '../../users/users.repository';
import { UserRoles } from '@app/shared/enums';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: AdminUsersService;
  let repository: UsersRepository;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          models: [UserModel],
          storage: ':memory:',
          autoLoadModels: true,
          sync: { force: true },
        }),
        SequelizeModule.forFeature([UserModel]),
      ],
      providers: [AdminUsersService, UsersRepository],
      exports: [SequelizeModule],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    service = module.get<AdminUsersService>(AdminUsersService);
    sequelize = module.get<Sequelize>(Sequelize);
  });

  afterAll(async () => {
    await sequelize.drop();
    await sequelize.close();
  });

  afterEach(async () => {
    await UserModel.truncate();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('give access', () => {
    it('should give access to user', async () => {
      const noAccessUser = await repository.create({
        fullname: 'Some name',
        email: 'some@exists.com',
        password: '123456',
        role: UserRoles.USER,
        hasAccess: false,
      });

      const updatedUser = await service.giveUserAccess(noAccessUser.userId);

      expect(updatedUser.hasAccess).toBeTruthy();
    });

    it('should throw if user do not exists', async () => {
      await expect(service.giveUserAccess('someid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
