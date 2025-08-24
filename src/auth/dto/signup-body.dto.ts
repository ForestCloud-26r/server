import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupBodyDto {
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
}
