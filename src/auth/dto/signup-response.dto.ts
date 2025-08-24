import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@app/shared/dtos';

export class SignupResponseDto {
  @ApiProperty({ example: 'jwt token' })
  readonly auth_token!: string;

  @ApiProperty({ type: UserDto })
  readonly user!: UserDto;
}
