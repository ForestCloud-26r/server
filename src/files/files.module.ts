import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { EnvParams } from '@app/shared/enums';
import { buildFileName } from '@app/shared/utils';
import { diskStorage } from 'multer';
import { FilesRepository } from './files.repository';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        storage: diskStorage({
          destination: config.getOrThrow<string>(EnvParams.UPLOADS_DEST),
          filename: (_req, file, callback) => {
            const fileName = buildFileName(file);
            callback(null, fileName);
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, FilesRepository],
})
export class FilesModule {}
