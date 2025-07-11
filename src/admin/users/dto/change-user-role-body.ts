import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRoles } from '@app/shared/enums';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeUserRoleBody {
  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRoles)
  @IsOptional()
  @ApiProperty({ example: UserRoles.ADMIN })
  role!: UserRoles;
}
