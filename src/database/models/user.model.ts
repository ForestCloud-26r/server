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
  userId!: string;

  @Column
  fullname!: string;

  @Unique
  @Column
  email!: string;

  @Column
  password!: string;

  @Default(UserRoles.USER)
  @Column({
    type: DataType.ENUM(...Object.values(UserRoles)),
  })
  role!: UserRoles;

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
