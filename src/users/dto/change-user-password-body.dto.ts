import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeUserPasswordBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'myoldpassword' })
  oldPassword!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'newpass' })
  newPassword!: string;
}
