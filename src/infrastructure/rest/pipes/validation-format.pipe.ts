import { ArgumentMetadata, Injectable, PipeTransform, UnprocessableEntityException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

interface IValidationError {
  property: string;
  errors: string[];
  constraints: {
    [type: string]: string;
  };
}

/**
 * Validation Pipe.
 * Gets Validation errors and creates custom error messages
 */
@Injectable()
export class ValidationFormatPipe implements PipeTransform<any> {
  public async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new UnprocessableEntityException(this.formatErrors(errors));
    }

    return value;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[], parentProperty = null): IValidationError[] {
    const res = [];

    for (const error of errors) {
      if (error.children && error.children.length > 0) {
        res.push(
          ...this.formatErrors(error.children, parentProperty ? `${parentProperty}.${error.property}` : error.property),
        );
      }

      if (error.constraints) {
        res.push({
          property: parentProperty ? `${parentProperty}.${error.property}` : error.property,
          errors: Object.keys(error.constraints),
          constraints: error.constraints,
        });
      }
    }

    return [...res];
  }
}
