import { ApiProperty } from '@nestjs/swagger';
import { UserPayloadDto } from '@app/shared/dtos';

export class SigninResponseDto {
  @ApiProperty({ example: 'jwt token' })
  readonly auth_token!: string;

  @ApiProperty({ type: UserPayloadDto })
  readonly user!: UserPayloadDto;
}
