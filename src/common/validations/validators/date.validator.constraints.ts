import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: 'IsEndDateAfterStartDate', async: false })
export class IsEndDateAfterStartDateConstraint implements ValidatorConstraintInterface {

  validate(endDate: any, args: ValidationArguments) {
    const startDate = args.object[args.constraints[0]]; // Retrieve the start date from the object
    return endDate >= startDate;
  }

  defaultMessage(args: ValidationArguments) {
    return 'End date must be larger than the start date';
  }
}



export function IsEndDateAfterStartDate(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsEndDateAfterStartDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsEndDateAfterStartDateConstraint,
    });
  };
}