import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
  @ApiProperty({ example: '0197d0ae-ab4a-7bf3-a32e-4fe889c2e2db' })
  userId!: string;

  @ApiProperty({ example: '2025-07-09T14:25:39.487Z' })
  deletedAt!: Date;
}
