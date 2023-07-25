import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AppException } from '../../customs/custom.exception';
import { ExceptionCode } from 'src/common/enums/exception_code';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw AppException.badRequestException({
        code: ExceptionCode.VALIDATION_CODE,
        title: 'System error',
        message:
          'An internal server error has occurred. If the problem persists, please contact us.',
        errors: errors.map((error) => ({
          code: ExceptionCode.VALIDATION_CODE,
          field: error.property,
          message: Object.values(error.constraints).toString(),
        })),
      });
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
