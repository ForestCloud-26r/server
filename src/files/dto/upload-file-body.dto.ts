import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadFilesBodyDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'file',
  })
  files!: Express.Multer.File[];
}
