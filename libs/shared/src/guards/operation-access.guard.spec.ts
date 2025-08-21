import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { ExecutionContext } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OperationAccessGuard } from './operation-access.guard';
import { AdminUserRepository } from '../../../../src/admin/users/admin-user.repository';
import { UserRoles } from '@app/shared/enums';
import type { UserPayloadDto } from '@app/shared/dtos';

describe('OperationAccessGuard', () => {
  let guard: OperationAccessGuard;
  let adminUserRepository: jest.Mocked<AdminUserRepository>;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockRequest: any;

  beforeEach(async () => {
    const mockAdminUserRepository = {
      findByPk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperationAccessGuard,
        {
          provide: Reflector,
          useValue: {},
        },
        {
          provide: AdminUserRepository,
          useValue: mockAdminUserRepository,
        },
      ],
    }).compile();

    guard = module.get<OperationAccessGuard>(OperationAccessGuard);
    adminUserRepository = module.get(AdminUserRepository);

    mockRequest = {
      user: {} as UserPayloadDto,
      params: {},
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as any;
  });

  describe('canActivate', () => {
    it('should allow access for OWNER role regardless of hasAccess', async () => {
      mockRequest.user = {
        userId: 'owner-id',
        role: UserRoles.OWNER,
        hasAccess: false, // Even with false hasAccess, owner should be allowed
        email: 'owner@test.com',
        fullname: 'Owner User',
      };

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should throw BadRequestException when userId parameter is missing', async () => {
      mockRequest.user = {
        userId: 'admin-id',
        role: UserRoles.ADMIN,
        hasAccess: true,
        email: 'admin@test.com',
        fullname: 'Admin User',
      };
      mockRequest.params = {}; // No userId parameter

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when target user is not found', async () => {
      mockRequest.user = {
        userId: 'admin-id',
        role: UserRoles.ADMIN,
        hasAccess: true,
        email: 'admin@test.com',
        fullname: 'Admin User',
      };
      mockRequest.params = { userId: 'non-existent-id' };
      adminUserRepository.findByPk.mockResolvedValue(null);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should allow ADMIN to perform operations on USER role', async () => {
      mockRequest.user = {
        userId: 'admin-id',
        role: UserRoles.ADMIN,
        hasAccess: true,
        email: 'admin@test.com',
        fullname: 'Admin User',
      };
      mockRequest.params = { userId: 'target-user-id' };

      const targetUser = {
        userId: 'target-user-id',
        role: UserRoles.USER,
        hasAccess: true,
        email: 'user@test.com',
        fullname: 'Target User',
      };
      adminUserRepository.findByPk.mockResolvedValue(targetUser as any);

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should prevent ADMIN from performing operations on ADMIN or OWNER roles', async () => {
      mockRequest.user = {
        userId: 'admin-id',
        role: UserRoles.ADMIN,
        hasAccess: true,
        email: 'admin@test.com',
        fullname: 'Admin User',
      };
      mockRequest.params = { userId: 'target-admin-id' };

      const targetUser = {
        userId: 'target-admin-id',
        role: UserRoles.ADMIN, // Admin trying to operate on another admin
        hasAccess: true,
        email: 'admin2@test.com',
        fullname: 'Target Admin',
      };
      adminUserRepository.findByPk.mockResolvedValue(targetUser as any);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should not allow ADMIN without hasAccess to perform operations', async () => {
      // This test demonstrates the security fix
      mockRequest.user = {
        userId: 'admin-id',
        role: UserRoles.ADMIN,
        hasAccess: false, // Admin user without access
        email: 'admin@test.com',
        fullname: 'Admin User',
      };
      mockRequest.params = { userId: 'target-user-id' };

      const targetUser = {
        userId: 'target-user-id',
        role: UserRoles.USER,
        hasAccess: true,
        email: 'user@test.com',
        fullname: 'Target User',
      };
      adminUserRepository.findByPk.mockResolvedValue(targetUser as any);

      // Should now throw ForbiddenException due to hasAccess check
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new ForbiddenException('User does not have access'),
      );
    });

    it('should allow USER role to perform operations (if they somehow get to this guard)', async () => {
      // Note: In practice, USER role would be blocked by RoleGuard before reaching this guard
      mockRequest.user = {
        userId: 'user-id',
        role: UserRoles.USER,
        hasAccess: true,
        email: 'user@test.com',
        fullname: 'User',
      };
      mockRequest.params = { userId: 'target-user-id' };

      const targetUser = {
        userId: 'target-user-id',
        role: UserRoles.USER,
        hasAccess: true,
        email: 'target@test.com',
        fullname: 'Target User',
      };
      adminUserRepository.findByPk.mockResolvedValue(targetUser as any);

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should not allow USER role without hasAccess to perform operations', async () => {
      mockRequest.user = {
        userId: 'user-id',
        role: UserRoles.USER,
        hasAccess: false, // User without access
        email: 'user@test.com',
        fullname: 'User',
      };
      mockRequest.params = { userId: 'target-user-id' };

      // Should throw ForbiddenException before even checking target user
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new ForbiddenException('User does not have access'),
      );

      // Verify that findByPk was never called since hasAccess check comes first
      expect(adminUserRepository.findByPk).not.toHaveBeenCalled();
    });
  });
});
