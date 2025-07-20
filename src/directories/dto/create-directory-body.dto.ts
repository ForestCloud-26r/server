import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDirectoryBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Directory name' })
  dirname!: string;
}
