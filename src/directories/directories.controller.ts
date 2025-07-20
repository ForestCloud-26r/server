import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { DirectoriesService } from './directories.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileDto, RejectResponseDto, UserPayloadDto } from '@app/shared/dtos';
import { JwtGuard } from '@app/shared/guards';
import { CreateDirectoryBodyDto } from './dto/create-directory-body.dto';
import { SetParentQueryDto } from '../files/dto/set-parent-query.dto';
import { User } from '@app/shared/decorators';
import { GetFilesResponseDto } from './dto/get-files-response.dto';

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

  @Get('/files')
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
}
