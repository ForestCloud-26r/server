import { UserRoles } from '@app/shared/enums';
import { SetMetadata } from '@nestjs/common';

export const ROLES_METADATA_KEY = 'roles';
export const Roles = (roles: UserRoles[]) =>
  SetMetadata(ROLES_METADATA_KEY, roles);
