import {
  AllowNull,
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
  hasAccess?: boolean;
  mustChangePassword?: boolean;
}

@Table({ tableName: 'users', timestamps: true, paranoid: true })
export class UserModel extends Model<UserModel, UserCreationAttributes> {
  @PrimaryKey
  @Column
  declare userId: string;

  @AllowNull(false)
  @Column
  declare fullname: string;

  @Unique
  @AllowNull(false)
  @Column
  declare email: string;

  @AllowNull(false)
  @Column
  declare password: string;

  @AllowNull(false)
  @Default(UserRoles.USER)
  @Column({
    type: DataType.ENUM(...Object.values(UserRoles)),
  })
  declare role: UserRoles;

  @AllowNull
  @Default(false)
  @Column
  declare hasAccess: boolean;

  @AllowNull
  @Default(false)
  @Column
  declare mustChangePassword: boolean;

  @CreatedAt
  @Column
  declare createdAt: Date;

  @UpdatedAt
  @Column
  declare updatedAt: Date;

  @Default(null)
  @AllowNull
  @DeletedAt
  @Column({ type: DataType.DATE })
  declare deletedAt: Date | null;
}
