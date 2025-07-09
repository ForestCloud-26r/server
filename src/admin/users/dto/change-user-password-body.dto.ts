import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeUserPasswordBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'newpass' })
  newPassword!: string;
}
