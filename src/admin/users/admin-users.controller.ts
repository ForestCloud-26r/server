import { Controller, Param, Put, UseGuards } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RejectResponseDto, UserDto } from '@app/shared/dtos';
import { GetUserByIdParamsDto } from './dto/get-user-by-id-params.dto';
import { JwtGuard, RoleGuard } from '@app/shared/guards';
import { Roles } from '@app/shared/decorators';
import { UserRoles } from '@app/shared/enums';

@ApiTags('Admin users')
@ApiResponse({
  status: 403,
  type: RejectResponseDto,
})
@ApiResponse({
  status: 401,
  type: RejectResponseDto,
})
@ApiBearerAuth()
@Roles([UserRoles.ADMIN])
@UseGuards(JwtGuard, RoleGuard)
@Controller({ path: 'admin/users', version: '1' })
export class AdminUsersController {
  constructor(private readonly usersService: AdminUsersService) {}

  @ApiOperation({ summary: 'Give signed up user access' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    type: RejectResponseDto,
  })
  @Put(':userId/give-access')
  public async giveUserAccess(
    @Param() { userId }: GetUserByIdParamsDto,
  ): Promise<UserDto> {
    return this.usersService.giveUserAccess(userId);
  }
}
