import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FileDto } from '@app/shared/dtos';
import { FilesRepository } from './files.repository';
import { toFileDto } from '@app/shared/builders';
import { ConfigService } from '@nestjs/config';
import { EnvParams } from '@app/shared/enums';
import * as path from 'path';
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
    userId: string,
  ): Promise<FileDto> {
    const fileMetadata = await this.filesRepository.saveFileMetadata(
      file,
      userId,
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

    return await new Promise<FileDto>((resolve, reject) => {
      response.download(resolvedPath, file.originalName, (error: Error) => {
        if (error) {
          this.logger.error(`downloadFile: ${error}`);
          response.status(500).end();
          reject(error);
        }
        resolve(toFileDto(file));
      });
    });
  }
}
