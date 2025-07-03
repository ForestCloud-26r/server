import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    LoggerModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
