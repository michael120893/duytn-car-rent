import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  private constructor(options: AppExceptionOptions, statusCode: HttpStatus) {
    super({ error: options }, statusCode);
  }

  public static badRequestException(options: AppExceptionOptions) {
    return new AppException(options, HttpStatus.BAD_REQUEST);
  }

  public static conflictException(options: AppExceptionOptions) {
    return new AppException(options, HttpStatus.CONFLICT);
  }

  public static forbiddenException(options: AppExceptionOptions) {
    return new AppException(options, HttpStatus.FORBIDDEN);
  }

  public static unauthorizedException(options: AppExceptionOptions) {
    return new AppException(options, HttpStatus.UNAUTHORIZED);
  }

  public static notFoundException(options: AppExceptionOptions) {
    return new AppException(options, HttpStatus.NOT_FOUND);
  }

  public static internalServerException(options: AppExceptionOptions) {
    return new AppException(options, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export interface AppExceptionOptions {
  error_id?: string;
  code?: string;
  title?: string;
  message?: string;
  errors?: AppExceptionDetail[];
}
export interface AppExceptionDetail {
  error_id: string;
  field: string;
  message: string;
}

export class AppExceptionBody {
  static carNotFound(): AppExceptionOptions {
    return {
      error_id: 'CAR-0001',
      code: 'NOT_FOUND',
      title: 'An error has occurred',
      message: 'Car id is not found',
      errors: [],
    };
  }

  static carNotAvailable(): AppExceptionOptions {
    return {
      error_id: 'CAR-0002',
      code: 'BAD_REQUEST',
      title: 'An error has occurred',
      message: 'Car id is not available for rent',
      errors: [],
    };
  }

  static cityNotFound(): AppExceptionOptions {
    return {
      error_id: 'CITY-0001',
      code: 'NOT_FOUND',
      title: 'An error has occurred',
      message: 'City id is not found',
      errors: [],
    };
  }

  static invalidEmailOrPassword(): AppExceptionOptions {
    return {
      error_id: 'USER-0001',
      code: 'INVALID_PARAMETER',
      title: 'An error has occurred',
      message: 'Invalid email or password',
      errors: [],
    };
  }

  static invalidParamater(errors: AppExceptionDetail[]): AppExceptionOptions {
    return {
      error_id: 'SYS-0005',
      code: 'INVALID_PARAMETER',
      title: 'An error has occurred',
      message: 'The format of the fields is invalid',
      errors: errors,
    };
  }

  static userNotFound(): AppExceptionOptions {
    return {
      error_id: 'USER-0002',
      code: 'OBJECT_NOT_FOUND',
      title: 'An error has occurred',
      message: 'User id is not found',
      errors: [],
    };
  }

  static userExists(): AppExceptionOptions {
    return {
      error_id: 'USER-0003',
      code: 'CONFLICT',
      title: 'An error has occurred',
      message: 'User already exists',
      errors: [],
    };
  }

  static orderNotFound(): AppExceptionOptions {
    return {
      error_id: 'ORDER-0001',
      code: 'NOT_FOUND',
      title: 'An error has occurred',
      message: 'Order id is not found',
      errors: [],
    };
  }

  static unauthorizedAccess(): AppExceptionOptions {
    return {
      error_id: 'SYS-0401',
      code: 'UNAUTHORIZED_ACCESS',
      title: 'User not authenticated',
      message:
        'User authentication has not been performed. You need to log in again.',
      errors: [],
    };
  }

  static couponNotFound(): AppExceptionOptions {
    return {
      error_id: 'COU-0001',
      code: 'NOT_FOUND',
      title: 'An error has occurred',
      message: 'Coupon is not found.',
      errors: [],
    };
  }

  static couponIsExpired(): AppExceptionOptions {
    return {
      error_id: 'COU-0001',
      code: 'NOT_FOUND',
      title: 'An error has occurred',
      message: 'Coupon is expired.',
      errors: [],
    };
  }

  static internalServerError(message?: string): AppExceptionOptions {
    return {
      error_id: 'SYS-0001',
      code: 'INTERNAL_SERVER_ERROR',
      title: 'An error has occurred',
      message: message ?? 'Internal server error',
      errors: [],
    };
  }
}
