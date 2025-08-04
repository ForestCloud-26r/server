import { FileDto } from '@app/shared/dtos';
import { ApiProperty } from '@nestjs/swagger';

export class UploadFilesResponseDto {
  @ApiProperty({ type: [FileDto] })
  declare files: FileDto[];
}
