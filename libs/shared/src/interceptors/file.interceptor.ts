import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import type e from 'express';
import type { Observable } from 'rxjs';

export class FileValidationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(FileValidationInterceptor.name);

  constructor(private readonly key: string) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request: e.Request = context.switchToHttp().getRequest();

    const { file } = request;

    if (!file) {
      throw new BadRequestException('File is required');
    }

    return next.handle();
  }
}
