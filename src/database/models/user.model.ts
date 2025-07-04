import {
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { UserRoles } from '@app/shared/enums';

export interface UserCreationAttributes {
  fullname: string;
  email: string;
  password: string;
  role?: UserRoles;
}

@Table({ tableName: 'users', timestamps: true, paranoid: true })
export class UserModel extends Model<UserModel, UserCreationAttributes> {
  @PrimaryKey
  @Column
  declare userId: string;

  @Column
  declare fullname: string;

  @Unique
  @Column
  declare email: string;

  @Column
  declare password: string;

  @Default(UserRoles.USER)
  @Column({
    type: DataType.ENUM(...Object.values(UserRoles)),
  })
  declare role: UserRoles;

  @CreatedAt
  @Column
  declare createdAt: Date;

  @UpdatedAt
  @Column
  declare updatedAt: Date;

  @DeletedAt
  @Column
  declare deletedAt: Date;
}
