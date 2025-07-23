import type { CustomDecorator } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

export const ACCESS_PERMISSION_KEY = 'ACCESS_PERMISSION_KEY';
export const AccessPermission = <T>(
  accessToId: string | keyof T,
): CustomDecorator<string> => SetMetadata(ACCESS_PERMISSION_KEY, accessToId);
