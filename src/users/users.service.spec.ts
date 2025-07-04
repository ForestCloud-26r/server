import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '../database/models/user.model';
import { Sequelize } from 'sequelize-typescript';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRoles } from '../../libs/shared/src/enums';

describe('UsersService', () => {
  let service: UsersService;
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
      providers: [UsersService, UsersRepository],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
    sequelize = module.get<Sequelize>(Sequelize);
  });

  afterAll(async () => {
    await sequelize.drop();
    await sequelize.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create user', async () => {
    const dto: CreateUserDto = {
      email: 'test@email.com',
      fullname: 'name',
      password: 'password',
    };

    const createdUser = await service.createUser(dto);
    const userInDb = await repository.findByPk(createdUser.userId);

    expect(createdUser).toBeDefined();
    expect(createdUser.email).toBe(dto.email);
    expect(createdUser.fullname).toBe(dto.fullname);
    expect(createdUser.role).toBe(UserRoles.USER);

    expect(userInDb?.password).not.toBe(dto.password);
  });

  it('Should find all admins', async () => {
    const dto: CreateUserDto = {
      email: 'admin@email.com',
      fullname: 'name',
      password: 'password',
      role: UserRoles.ADMIN,
    };

    const createdUser = await service.createUser(dto);
    const [admin] = await service.findAllAdmins();

    expect(createdUser).toBeDefined();
    expect(createdUser.email).toBe(dto.email);
    expect(createdUser.fullname).toBe(dto.fullname);
    expect(createdUser.role).toBe(UserRoles.ADMIN);

    expect(admin).toBeDefined();
    expect(admin.email).toBe(dto.email);
    expect(admin.fullname).toBe(dto.fullname);
    expect(admin.role).toBe(UserRoles.ADMIN);
  });

  it('Should find user by email', async () => {
    const dto: CreateUserDto = {
      email: 'test@email.com',
      fullname: 'name',
      password: 'password',
    };

    const user = await service.getUserByEmail('test@email.com');

    expect(user).toBeDefined();
    expect(user?.email).toBe(dto.email);
    expect(user?.fullname).toBe(dto.fullname);
    expect(user?.role).toBe(UserRoles.USER);
    expect(user?.password).not.toBe(dto.password);
  });
});
