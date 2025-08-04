import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import type e from 'express';
import type { Observable } from 'rxjs';

export class FilesValidationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(FilesValidationInterceptor.name);

  constructor(private readonly key: string) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request: e.Request = context.switchToHttp().getRequest();

    const { files } = request;

    if (!files || !files.length) {
      throw new BadRequestException('No files provided');
    }

    return next.handle();
  }
}
