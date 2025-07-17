import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FileDto, UserPayloadDto } from '@app/shared/dtos';
import { FilesRepository } from './files.repository';
import { toFileDto } from '@app/shared/builders';
import { ConfigService } from '@nestjs/config';
import { EnvParams } from '@app/shared/enums';
import path from 'node:path';
import e from 'express';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    private readonly filesRepository: FilesRepository,
    private readonly config: ConfigService,
  ) {}

  public async uploadFile(
    file: Express.Multer.File,
    userDto: UserPayloadDto,
  ): Promise<FileDto> {
    const fileMetadata = await this.filesRepository.saveFileMetadata(
      file,
      userDto,
    );

    return toFileDto(fileMetadata);
  }

  public async downloadFile(
    fileId: string,
    userId: string,
    response: e.Response,
  ): Promise<FileDto> {
    const file = await this.filesRepository.getUserFileById(fileId, userId);

    const uploadsDestination = this.config.getOrThrow<string>(
      EnvParams.UPLOADS_DEST,
    );
    const baseDir = path.resolve(uploadsDestination);

    const resolvedPath = path.resolve(file.storagePath);

    if (!resolvedPath.startsWith(baseDir)) {
      throw new BadRequestException('Unsafe path access');
    }

    response.download(resolvedPath, file.fileName, (error: Error) => {
      this.logger.error(`downloadFile: ${error}`);
      throw new InternalServerErrorException();
    });

    return toFileDto(file);
  }
}
