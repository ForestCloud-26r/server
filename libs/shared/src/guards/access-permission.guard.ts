import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FilesRepository } from '../../../../src/files/files.repository';
import { extractUserFromRequest } from '@app/shared/utils';
import { ACCESS_PERMISSION_KEY } from '@app/shared/decorators';
import e from 'express';

@Injectable()
export class AccessPermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly filesRepository: FilesRepository,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: e.Request = context.switchToHttp().getRequest();
    const user = extractUserFromRequest(request);

    const paramName = this.reflector.getAllAndOverride<string>(
      ACCESS_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    const accessToId = request.params[paramName] ?? request.query[paramName];

    if (!accessToId && paramName === 'parentId') {
      return true;
    }

    const foundRecord = await this.filesRepository.findOne(
      {
        fileId: accessToId,
      },
      {
        paranoid: false,
      },
    );

    if (!foundRecord) {
      throw new NotFoundException(
        `File or directory not found by ${accessToId} id`,
      );
    }

    return Boolean(foundRecord.userId === user.userId);
  }
}
