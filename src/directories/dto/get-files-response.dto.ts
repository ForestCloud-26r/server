import { FileDto } from '@app/shared/dtos';
import { ApiProperty } from '@nestjs/swagger';

export class GetFilesResponseDto {
  @ApiProperty({ type: [FileDto] })
  files!: FileDto[];
}
