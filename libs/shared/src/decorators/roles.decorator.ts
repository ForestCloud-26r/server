import type { UserRoles } from '@app/shared/enums';
import type { CustomDecorator } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

export const ROLES_METADATA_KEY = 'roles';
export const Roles = (roles: UserRoles[]): CustomDecorator<string> =>
  SetMetadata(ROLES_METADATA_KEY, roles);
