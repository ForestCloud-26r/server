import { UserRoles } from '@app/shared/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  @ApiProperty({ example: '0197d0ae-ab4a-7bf3-a32e-4fe889c2e2db' })
  userId!: string;

  @Expose()
  @ApiProperty({ example: 'Full Name' })
  fullname!: string;

  @Expose()
  @ApiProperty({ example: 'myemail@email.com' })
  email!: string;

  @Expose()
  @ApiProperty({ enum: UserRoles, example: UserRoles.ADMIN })
  role!: UserRoles;

  @Expose()
  @ApiProperty({ example: true })
  hasAccess!: boolean;

  @Expose()
  @ApiProperty({ example: '2025-07-03T14:28:11.981Z' })
  createdAt!: Date;

  @Expose()
  @ApiProperty({ example: '2025-07-03T14:28:11.981Z' })
  updatedAt!: Date;

  @Expose()
  @ApiProperty({ example: '2025-07-03T14:28:11.981Z' })
  deletedAt!: Date;
}
