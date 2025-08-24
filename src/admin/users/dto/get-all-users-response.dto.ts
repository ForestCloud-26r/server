import { UserDto } from '@app/shared/dtos';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllUsersResponseDto {
  @ApiProperty({ type: [UserDto] })
  users!: UserDto[];
}
