import { AbstractRepository } from 'nest-sequelize-repository';
import { FileModel } from '../database/models/file.model';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable, NotFoundException } from '@nestjs/common';
import { extractFilename } from '@app/shared/utils';

@Injectable()
export class FilesRepository extends AbstractRepository<FileModel> {
  constructor(
    @InjectModel(FileModel) private readonly fileModel: typeof FileModel,
  ) {
    super(fileModel, {
      autoGenerateId: true,
      idField: 'fileId',
    });
  }

  public async saveFileMetadata(
    file: Express.Multer.File,
    userId: string,
  ): Promise<FileModel> {
    return await this.create({
      userId,
      fileName: extractFilename(file.originalname),
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      storagePath: file.path,
    });
  }

  public async getUserFileById(
    fileId: string,
    userId: string,
  ): Promise<FileModel> {
    const file = await this.findOne({
      fileId,
      userId,
    });

    if (!file) {
      throw new NotFoundException(`File not found by ${fileId} id`);
    }

    return file;
  }
}
