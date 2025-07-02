import { Global, Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { EnvParams } from '@app/shared/enums';

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'sqlite',
        storage: configService.getOrThrow<string>(EnvParams.SQLITE_DB),
        models: [],
        autoLoadModels: true,
        sync: { alter: false, force: false },
        logging: (message) => Logger.log(message, DatabaseModule.name),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
