import { PipeTransform, BadRequestException } from '@nestjs/common';
import { Schema } from 'joi';

export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  transform(value: any) {
    const { error, value: validated } = this.schema.validate(value, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      throw new BadRequestException(
        error.details.map(d => d.message)
      );
    }

    return validated;
  }
}