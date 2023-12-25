import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsRegexConstraint implements ValidatorConstraintInterface {
  public validate(regexString: string, args: ValidationArguments): boolean {
    try {
      new RegExp(regexString);

      return true;
    } catch {
      return false;
    }
  }

  public defaultMessage(args: ValidationArguments): string {
    return `${args.property} is not valid regex`;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function IsRegex(validationOptions?: ValidationOptions): Function {
  return function (object: NonNullable<unknown>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRegexConstraint,
    });
  };
}
