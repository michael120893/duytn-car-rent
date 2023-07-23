import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class ResponseInterceptor<T> implements NestInterceptor<T, { data: T }> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ data: T }> {
    return next.handle().pipe(map((response) => ({ data: response })));
  }
}
