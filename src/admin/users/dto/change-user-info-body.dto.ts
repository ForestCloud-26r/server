import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ChangeUserInfoBodyDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Full Name' })
  fullname?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ example: 'myemail@email.com' })
  email?: string;
}
