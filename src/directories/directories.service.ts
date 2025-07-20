import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDirectoryBodyDto } from './dto/create-directory-body.dto';
import { FileDto } from '@app/shared/dtos';
import { toFileDto } from '@app/shared/builders';
import { FilesRepository } from '../files/files.repository';

@Injectable()
export class DirectoriesService {
  constructor(private readonly filesRepository: FilesRepository) {}

  public async createDirectory(
    createDirectoryDto: CreateDirectoryBodyDto,
    userId: string,
    parentId?: string,
  ): Promise<FileDto> {
    if (parentId) {
      const parentFile = await this.filesRepository.findOne({
        fileId: parentId,
        userId,
      });

      if (!parentFile) {
        throw new NotFoundException('Parent directory not found');
      }

      if (parentFile.mimeType !== 'text/directory') {
        throw new BadRequestException('Parent file is not a directory');
      }
    }

    const fileMetadata = await this.filesRepository.saveDirectoryMetadata(
      createDirectoryDto.dirname,
      userId,
      parentId,
    );

    return toFileDto(fileMetadata);
  }
}
