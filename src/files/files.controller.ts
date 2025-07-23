import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileDto, RejectResponseDto } from '@app/shared/dtos';
import { AccessPermissionGuard, JwtGuard } from '@app/shared/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationInterceptor } from '@app/shared/interceptors';
import { AccessPermission, User } from '@app/shared/decorators';
import { DownloadFileParamsDto } from './dto/download-file-params.dto';
import e from 'express';
import { UploadFileBodyDto } from './dto/upload-file-body.dto';
import { SetParentQueryDto } from './dto/set-parent-query.dto';
import { GetFileParamsDto } from './dto/get-file-params.dto';

@ApiTags('Files')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  type: RejectResponseDto,
})
@UseGuards(JwtGuard)
@Controller({ path: 'files', version: '1' })
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @AccessPermission<SetParentQueryDto>('parentId')
  @UseGuards(AccessPermissionGuard)
  @UseInterceptors(
    FileInterceptor('file'),
    new FileValidationInterceptor('file'),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload file to the server' })
  @ApiResponse({
    status: 200,
    type: FileDto,
  })
  @ApiResponse({
    status: 400,
    type: RejectResponseDto,
  })
  @ApiBody({
    type: UploadFileBodyDto,
  })
  public async uploadFile(
    @Query() { parentId }: SetParentQueryDto,
    @UploadedFile() file: Express.Multer.File,
    @User('userId') userId: string,
  ): Promise<FileDto> {
    return this.filesService.uploadFile(file, userId, parentId);
  }

  @Put(':fileId/trash')
  @AccessPermission<GetFileParamsDto>('fileId')
  @UseGuards(AccessPermissionGuard)
  @ApiOperation({
    summary: 'Move file to trash',
  })
  @ApiResponse({
    status: 200,
    type: FileDto,
  })
  @ApiResponse({
    status: 400,
    type: RejectResponseDto,
  })
  @ApiResponse({
    status: 403,
    type: RejectResponseDto,
  })
  public async moveToTrash(
    @Param() { fileId }: GetFileParamsDto,
  ): Promise<FileDto> {
    return this.filesService.moveToTrash(fileId);
  }

  @Put(':fileId/restore')
  @AccessPermission<GetFileParamsDto>('fileId')
  @UseGuards(AccessPermissionGuard)
  @ApiOperation({
    summary: 'Restore file from trash',
  })
  @ApiResponse({
    status: 200,
    type: FileDto,
  })
  @ApiResponse({
    status: 400,
    type: RejectResponseDto,
  })
  @ApiResponse({
    status: 403,
    type: RejectResponseDto,
  })
  public async restoreFromTrash(
    @Param() { fileId }: GetFileParamsDto,
  ): Promise<FileDto> {
    return this.filesService.restoreFile(fileId);
  }

  @Delete(':fileId')
  @AccessPermission<GetFileParamsDto>('fileId')
  @UseGuards(AccessPermissionGuard)
  @ApiOperation({
    summary: 'Permanently delete file',
  })
  @ApiResponse({
    status: 200,
    type: FileDto,
  })
  @ApiResponse({
    status: 400,
    type: RejectResponseDto,
  })
  @ApiResponse({
    status: 403,
    type: RejectResponseDto,
  })
  public async delete(@Param() { fileId }: GetFileParamsDto): Promise<FileDto> {
    return this.filesService.deleteFile(fileId);
  }

  @Get('download/:fileId')
  @ApiOperation({ summary: 'Download file by id' })
  @ApiResponse({
    status: 200,
    type: FileDto,
  })
  @ApiResponse({
    status: 500,
    type: RejectResponseDto,
  })
  @ApiResponse({
    status: 404,
    type: RejectResponseDto,
  })
  public async downloadFile(
    @Param() { fileId }: DownloadFileParamsDto,
    @User('userId') userId: string,
    @Res() response: e.Response,
  ): Promise<FileDto> {
    return this.filesService.downloadFile(fileId, userId, response);
  }
}
