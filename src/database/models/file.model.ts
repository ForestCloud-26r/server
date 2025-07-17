import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UserModel } from './user.model';

export interface FileCreationAttributes {
  userId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  storagePath: string;
}

@Table({ tableName: 'files_metadata', paranoid: true, timestamps: true })
export class FileModel extends Model<FileModel, FileCreationAttributes> {
  @PrimaryKey
  @Column
  declare fileId: string;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column
  declare userId: string;

  @AllowNull(false)
  @Column
  declare fileName: string;

  @AllowNull(false)
  @Column
  declare originalName: string;

  @AllowNull(false)
  @Column
  declare mimeType: string;

  @AllowNull(false)
  @Column
  declare size: number;

  @AllowNull(false)
  @Column
  declare storagePath: string;

  @BelongsTo(() => UserModel)
  declare user: UserModel;

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
