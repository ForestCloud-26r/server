import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FileDto } from '@app/shared/dtos';
import { FilesRepository } from './files.repository';
import { toFileDto } from '@app/shared/builders';
import { ConfigService } from '@nestjs/config';
import { EnvParams } from '@app/shared/enums';
import * as path from 'path';
import e from 'express';
import { Transaction } from 'sequelize';

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
    parentId?: string,
  ): Promise<FileDto> {
    if (!parentId) {
      const fileMetadata = await this.filesRepository.saveFileMetadata(
        file,
        userId,
      );

      return toFileDto(fileMetadata);
    }

    return await this.filesRepository.transaction(async (transaction) => {
      const fileMetadata = await this.filesRepository.saveFileMetadata(
        file,
        userId,
        parentId,
        transaction,
      );

      await this.resizeParentDirectory(
        parentId,
        fileMetadata.size,
        transaction,
      );

      return toFileDto(fileMetadata);
    });
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

  private async resizeParentDirectory(
    parentId: string,
    childSize: number,
    transaction?: Transaction,
  ): Promise<void> {
    let currentParentId: string | null = parentId;
    let accumulatedSize: number = childSize;

    while (currentParentId) {
      const parentFile = await this.filesRepository.findByPk(currentParentId, {
        transaction,
      });

      if (!parentFile) {
        throw new NotFoundException('Parent directory not found');
      }

      if (parentFile.mimeType !== 'text/directory') {
        throw new BadRequestException('Parent file is not a directory');
      }

      const newSize = parentFile.size + accumulatedSize;

      await this.filesRepository.updateByPk(
        currentParentId,
        {
          size: newSize,
        },
        { transaction },
      );

      accumulatedSize = newSize;
      currentParentId = parentFile.parentId;
    }
  }

  public async moveToTrash(fileId: string): Promise<FileDto> {
    const trashedFile = await this.filesRepository.deleteByPk(fileId);

    if (!trashedFile) {
      throw new NotFoundException(`File not found by ${fileId} id`);
    }

    return toFileDto(trashedFile);
  }

  public async restoreFile(fileId: string): Promise<FileDto> {
    const restoredFile = await this.filesRepository.restoreByPk(fileId);

    if (!restoredFile) {
      throw new NotFoundException(`File not found by ${fileId} id`);
    }

    return toFileDto(restoredFile);
  }

  public async deleteFile(fileId: string): Promise<FileDto> {
    const deletedFile = await this.filesRepository.deleteByPk(fileId, {
      force: true,
    });

    if (!deletedFile) {
      throw new NotFoundException(`File not found by ${fileId} id`);
    }

    return toFileDto(deletedFile);
  }
}
