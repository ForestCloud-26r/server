import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChangeUserInfoBodyDto {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ example: 'some@email.com' })
  email?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Full Name' })
  fullname?: string;
}
