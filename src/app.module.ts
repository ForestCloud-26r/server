import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminUsersModule } from './admin/users/admin-users.module';
import { FilesModule } from './files/files.module';
import { MulterModule } from './multer/multer.module';
import { DirectoriesModule } from './directories/directories.module';
import { ConfigValidationService } from './config/config-validation.service';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ConfigValidationService.createSchema(),
    }),
    LoggerModule,
    AdminUsersModule,
    UsersModule,
    AuthModule,
    FilesModule,
    MulterModule,
    DirectoriesModule,
  ],
})
export class AppModule {}
