import type { FileModel } from '../../../../src/database/models/file.model';
import { FileDto } from '@app/shared/dtos';
import { plainToInstance } from 'class-transformer';

export const toFileDto = (fileModel: FileModel): FileDto => {
  return plainToInstance(FileDto, fileModel, {
    excludeExtraneousValues: true,
  });
};
