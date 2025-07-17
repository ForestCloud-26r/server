import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export declare class FileDto {
  @Expose()
  @ApiProperty({ example: '0197d0ae-ab4a-7bf3-a32e-4fe889c2e2db' })
  fileId: string;

  @Expose()
  @ApiProperty({ example: '0197d0ae-ab4a-7bf3-a32e-4fe889c2e2db' })
  userId: string;

  @Expose()
  @ApiProperty({ example: 'my-text.txt' })
  fileName: string;

  @Expose()
  @ApiProperty({ example: '0197d0ae-ab4a-7bf3-a32e-4fe889c2e2db_my-text.txt' })
  originalName: string;

  @Expose()
  @ApiProperty({ example: 'application/pdf' })
  mimeType: string;

  @Expose()
  @ApiProperty({ example: 5000 })
  size: number;

  @Expose()
  @ApiProperty({
    example: './uploads/0197d0ae-ab4a-7bf3-a32e-4fe889c2e2db_my-text.txt',
  })
  storagePath: string;

  @Expose()
  @ApiProperty({ example: '2025-07-03T14:28:11.981Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2025-07-03T14:28:11.981Z' })
  updatedAt: Date;

  @Expose()
  @ApiProperty({ example: '2025-07-03T14:28:11.981Z', nullable: true })
  declare deletedAt: Date | null;
}
