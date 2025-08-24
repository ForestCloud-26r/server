import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DirectoriesService } from './directories.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileDto, RejectResponseDto, UserPayloadDto } from '@app/shared/dtos';
import { AccessPermissionGuard, JwtGuard } from '@app/shared/guards';
import { CreateDirectoryBodyDto } from './dto/create-directory-body.dto';
import { SetParentQueryDto } from '../files/dto/set-parent-query.dto';
import { AccessPermission, User } from '@app/shared/decorators';
import { GetFilesResponseDto } from './dto/get-files-response.dto';
import { GetDirectoryParamDto } from './dto/get-directory-param.dto';

@ApiTags('Directories')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  type: RejectResponseDto,
})
@UseGuards(JwtGuard)
@Controller({ path: 'directories', version: '1' })
export class DirectoriesController {
  constructor(private readonly directoriesService: DirectoriesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create directory',
  })
  @ApiResponse({
    status: 200,
    type: FileDto,
  })
  @ApiResponse({
    status: 400,
    type: RejectResponseDto,
  })
  public async createDirectory(
    @Body() createDirectoryDto: CreateDirectoryBodyDto,
    @Query() { parentId }: SetParentQueryDto,
    @User('userId') userId: string,
  ): Promise<FileDto> {
    return this.directoriesService.createDirectory(
      createDirectoryDto,
      userId,
      parentId,
    );
  }

  @Get('content')
  @ApiOperation({
    summary: 'Get files in directory',
  })
  @ApiResponse({
    status: 200,
    type: GetFilesResponseDto,
  })
  @ApiResponse({
    status: 400,
    type: RejectResponseDto,
  })
  @ApiResponse({
    status: 404,
    type: RejectResponseDto,
  })
  public async getFiles(
    @Query() { parentId }: SetParentQueryDto,
    @User() { userId }: UserPayloadDto,
  ): Promise<GetFilesResponseDto> {
    return this.directoriesService.getFiles(userId, parentId);
  }

  @Put(':directoryId/rename')
  @AccessPermission<GetDirectoryParamDto>('directoryId')
  @UseGuards(AccessPermissionGuard)
  @ApiOperation({
    summary: 'Rename directory',
  })
  @ApiResponse({
    status: 400,
    type: RejectResponseDto,
  })
  @ApiResponse({
    status: 403,
    type: RejectResponseDto,
  })
  @ApiResponse({
    status: 200,
    type: FileDto,
  })
  public async renameDirectory(
    @Param() { directoryId }: GetDirectoryParamDto,
    @Body() { dirname }: CreateDirectoryBodyDto,
  ): Promise<FileDto> {
    return this.directoriesService.renameDirectory(directoryId, dirname);
  }

  @Put(':directoryId/trash')
  @AccessPermission<GetDirectoryParamDto>('directoryId')
  @UseGuards(AccessPermissionGuard)
  @ApiOperation({
    summary: 'Move directory to trash',
  })
  @ApiResponse({
    status: 403,
    type: RejectResponseDto,
  })
  @ApiResponse({
    status: 404,
    type: RejectResponseDto,
  })
  @ApiResponse({
    status: 200,
    type: FileDto,
  })
  public async trashDirectory(
    @Param() { directoryId }: GetDirectoryParamDto,
  ): Promise<FileDto> {
    return this.directoriesService.trashDirectory(directoryId);
  }

  @Put(':directoryId/restore')
  @AccessPermission<GetDirectoryParamDto>('directoryId')
  @UseGuards(AccessPermissionGuard)
  @ApiOperation({
    summary: 'Restore directory from trash',
  })
  @ApiResponse({
    status: 403,
    type: RejectResponseDto,
  })
  @ApiResponse({
    status: 404,
    type: RejectResponseDto,
  })
  @ApiResponse({
    status: 200,
    type: FileDto,
  })
  public async restoreDirectory(
    @Param() { directoryId }: GetDirectoryParamDto,
  ): Promise<FileDto> {
    return this.directoriesService.restoreDirectory(directoryId);
  }

  @Delete(':directoryId')
  @AccessPermission<GetDirectoryParamDto>('directoryId')
  @UseGuards(AccessPermissionGuard)
  @ApiOperation({
    summary: 'Delete directory',
  })
  @ApiResponse({
    status: 403,
    type: RejectResponseDto,
  })
  @ApiResponse({
    status: 404,
    type: RejectResponseDto,
  })
  @ApiResponse({
    status: 200,
    type: FileDto,
  })
  public async deleteDirectory(
    @Param() { directoryId }: GetDirectoryParamDto,
  ): Promise<FileDto> {
    return this.directoriesService.deleteDirectory(directoryId);
  }
}
