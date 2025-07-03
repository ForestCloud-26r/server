import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '@app/shared/enums';

export class CreateUserDto {
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
  @IsOptional()
  @ApiProperty({ example: UserRoles.ADMIN, default: UserRoles.USER })
  role?: UserRoles;
}
