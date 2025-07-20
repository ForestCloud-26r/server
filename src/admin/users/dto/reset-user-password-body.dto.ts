import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetUserPasswordBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'newpass' })
  newPassword!: string;
}
