import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPayloadDto } from '@app/shared/dtos';
import { UserRoles } from '@app/shared/enums';
import { ROLES_METADATA_KEY } from '@app/shared/decorators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const request: Express.Request = context.switchToHttp().getRequest();

    const userRole = (request.user as UserPayloadDto).role;

    const allowedRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!allowedRoles || userRole === UserRoles.ADMIN) {
      return true;
    }

    return allowedRoles.includes(userRole);
  }
}
