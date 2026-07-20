/**
 * ============================================================================
 * File: is-valid-color.validator.ts
 * ============================================================================
 *
 * Color Validator
 *
 * Responsibilities
 * ----------------
 * - Validate hexadecimal color values.
 * - Provide reusable color validation.
 * - Integrate with class-validator.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - class-validator
 * - TypeScript 5+
 * - Node.js 22+
 * ============================================================================
 */

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Matches hexadecimal colors.
 *
 * Examples:
 * - #FFFFFF
 * - #000000
 * - #3B82F6
 * - #abc
 */
const HEX_COLOR_REGEX = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

/**
 * Validates hexadecimal color strings.
 *
 * @param validationOptions Optional validation options.
 */
export function IsValidColor(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target: object, propertyName: string | symbol): void => {
    registerDecorator({
      name: 'isValidColor',
      target: target.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (value === null || value === undefined) {
            return true;
          }

          if (typeof value !== 'string') {
            return false;
          }

          return HEX_COLOR_REGEX.test(value);
        },

        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must be a valid hexadecimal color.`;
        },
      },
    });
  };
}
