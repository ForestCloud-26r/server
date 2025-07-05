import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@app/shared/decorators';
import { RejectResponseDto, UserPayloadDto } from '@app/shared/dtos';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@app/shared/guards';

@ApiTags('Users')
@ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  type: RejectResponseDto,
})
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  type: RejectResponseDto,
})
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current logged in user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserPayloadDto,
  })
  public async getCurrentLoggedUser(
    @User() userDto: UserPayloadDto,
  ): Promise<UserPayloadDto> {
    return Promise.resolve(userDto);
  }
}
