import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  AppException,
  AppExceptionBody,
} from 'src/common/exeptions/app.exception';

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
      const details = errors.map((error, index) => ({
        error_id: `INV-000${index}`,
        field: error.property,
        message: Object.values(error.constraints).toString(),
      }));
      throw AppException.badRequestException(
        AppExceptionBody.invalidParamater(details),
      );
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
