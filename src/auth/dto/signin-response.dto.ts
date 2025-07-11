import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserPayloadDto } from '@app/shared/dtos';

export class SigninResponseDto {
  @ApiProperty({ example: 'jwt token' })
  readonly auth_token!: string;

  @ApiProperty({ type: UserPayloadDto })
  readonly user!: UserPayloadDto;

  @ApiPropertyOptional({ example: 'Logged in successfully' })
  message?: string;

  @ApiPropertyOptional({ example: false })
  temporaryPasswordUsed?: boolean;
}
