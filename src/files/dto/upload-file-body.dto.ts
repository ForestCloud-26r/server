import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadFileBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'file',
  })
  file!: Express.Multer.File;
}
