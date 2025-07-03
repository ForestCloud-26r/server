import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RejectResponseDto {
  @ApiProperty({ example: 'Status code 400/401/...' })
  readonly status!: number;

  @ApiPropertyOptional({
    example: ['id should be a string', 'password is not strong enough'],
  })
  readonly message!: string;

  @ApiProperty({ example: 'Some error message' })
  readonly error?: string[];
}
