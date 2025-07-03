import { Global, Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { EnvParams } from '@app/shared/enums';
import { UserModel } from './models/user.model';

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'sqlite',
        storage: configService.getOrThrow<string>(EnvParams.SQLITE_DB),
        models: [UserModel],
        autoLoadModels: true,
        sync: { alter: false, force: false },
        logging: (msg) => Logger.log(msg, DatabaseModule.name),
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([UserModel]),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
