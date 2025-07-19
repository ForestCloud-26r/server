import {
  Controller,
  Get,
  Param,
  Post,
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
import { JwtGuard } from '@app/shared/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationInterceptor } from '@app/shared/interceptors';
import { User } from '@app/shared/decorators';
import { DownloadFileParamsDto } from './dto/download-file-params.dto';
import e from 'express';
import { UploadFileBodyDto } from './dto/upload-file-body.dto';

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
    @UploadedFile() file: Express.Multer.File,
    @User('userId') userId: string,
  ): Promise<FileDto> {
    return this.filesService.uploadFile(file, userId);
  }

  @Get(':fileId')
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
