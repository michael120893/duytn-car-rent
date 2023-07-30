import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DatabaseError } from 'sequelize';
import { AppException, AppExceptionBody } from '../exeptions/app.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message: string;
    let statusCode: number;

    if (exception instanceof AppException) {
      response.status(exception.getStatus()).json(exception.getResponse());
    } else {
      switch (true) {
        case exception instanceof HttpException:
          message = (exception as HttpException).message;
          statusCode = (exception as HttpException).getStatus();
          break;
        case exception instanceof DatabaseError:
          message = (exception as DatabaseError).message;
          statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
          break;
        default:
          message = 'Internal Server Error';
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          break;
      }

      Logger.error(
        message,
        (exception as any).stack,
        `${request.method} ${request.url}`,
      );

      response
        .status(statusCode)
        .json(AppExceptionBody.internalServerError(message));
    }
  }
}
