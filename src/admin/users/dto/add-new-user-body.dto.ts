import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '@app/shared/enums';

export class AddNewUserBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Full Name' })
  fullname!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'myemail@email.com' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Password123!' })
  password!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRoles)
  @ApiProperty({ example: UserRoles.ADMIN })
  role!: UserRoles;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: true })
  hasAccess!: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: true })
  mustChangePassword!: boolean;
}
