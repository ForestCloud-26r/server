import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { EnvParams } from '@app/shared/enums';
import { buildFileName } from '@app/shared/utils';
import { MulterModule as PlatformExpressMulter } from '@nestjs/platform-express';

@Module({
  imports: [
    PlatformExpressMulter.registerAsync({
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
})
export class MulterModule {}
