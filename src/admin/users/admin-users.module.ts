import { Module } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { AdminUsersController } from './admin-users.controller';
import { AdminUserRepository } from './admin-user.repository';

@Module({
  controllers: [AdminUsersController],
  providers: [AdminUsersService, AdminUserRepository],
})
export class AdminUsersModule {}
