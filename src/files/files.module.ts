import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FilesRepository } from './files.repository';
import { MulterModule } from '../multer/multer.module';
import { ValidateParentFile } from '@app/shared/validators';

@Module({
  imports: [MulterModule],
  controllers: [FilesController],
  providers: [FilesService, FilesRepository, ValidateParentFile],
})
export class FilesModule {}
