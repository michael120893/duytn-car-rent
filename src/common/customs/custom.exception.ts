import { HttpException, HttpStatus } from "@nestjs/common";
import { ExceptionCode } from "src/common/enums/exception_code";

export class AppException extends HttpException {
    private constructor(options: AppExceptionOptions, statusCode: HttpStatus) {
        super({ error: options }, statusCode);
    }

    public static badRequestException(options: AppExceptionOptions) {
        return new AppException(
            options,
            HttpStatus.BAD_REQUEST
        );
    };

    public static conflictException(options: AppExceptionOptions) {
        return new AppException(
            options,
            HttpStatus.CONFLICT
        );
    };

    public static forbiddenException(options: AppExceptionOptions) {
        return new AppException(
            options,
            HttpStatus.FORBIDDEN
        );
    };

    public static unauthorizedException(options: AppExceptionOptions) {
        return new AppException(
            options,
            HttpStatus.UNAUTHORIZED
        );
    };

    public static notFoundException(options: AppExceptionOptions) {
        return new AppException(
            options,
            HttpStatus.NOT_FOUND
        );
    };

    public static internalServerException() {
        return new AppException(
            {
                code: ExceptionCode.INTERNAL_SERVER_ERROR_CODE,
                title: 'Internal Server Error'
            },
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    };
}

export interface AppExceptionOptions {
    code?: string;
    title?: string;
    message?: string;
    errors?: DetailException[];

}
export interface DetailException {
    code: string;
    field: string;
    message: string;
}

