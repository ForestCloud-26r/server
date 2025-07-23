import { Module } from '@nestjs/common';
import { DirectoriesService } from './directories.service';
import { DirectoriesController } from './directories.controller';
import { FilesRepository } from '../files/files.repository';
import { ValidateParentFile } from '@app/shared/validators';

@Module({
  controllers: [DirectoriesController],
  providers: [DirectoriesService, FilesRepository, ValidateParentFile],
})
export class DirectoriesModule {}
