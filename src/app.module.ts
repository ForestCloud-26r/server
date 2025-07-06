import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminUsersModule } from './admin/users/admin-users.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    LoggerModule,
    AdminUsersModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
