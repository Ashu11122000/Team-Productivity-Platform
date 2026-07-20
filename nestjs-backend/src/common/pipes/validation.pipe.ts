/**
 * ============================================================================
 * File: validation.pipe.ts
 * ============================================================================
 *
 * Enterprise Validation Pipe
 *
 * Responsibilities
 * ----------------
 * - Centralize request validation configuration.
 * - Transform plain objects into DTO instances.
 * - Strip unknown properties.
 * - Reject unexpected properties.
 * - Reject invalid payloads with standardized errors.
 * - Keep main.ts clean.
 *
 * Why use this wrapper?
 * ---------------------
 * Instead of configuring ValidationPipe inside main.ts:
 *
 * app.useGlobalPipes(new ValidationPipe({...}));
 *
 * create a reusable enterprise pipe:
 *
 * app.useGlobalPipes(new AppValidationPipe());
 *
 * This keeps bootstrap logic minimal while making validation
 * configuration reusable and testable.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - class-validator
 * - class-transformer
 * - TypeScript 5+
 * ============================================================================
 */

import {
  BadRequestException,
  Injectable,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

import { ERROR_CODES } from '../constants';
import { ValidationMessages } from './../messages/validation.messages';

/**
 * Enterprise validation pipe.
 */
@Injectable()
export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      /**
       * Automatically transform request payloads into DTO instances.
       */
      transform: true,

      /**
       * Enable primitive type conversion.
       *
       * Example:
       * page=1 -> number
       * active=true -> boolean
       */
      transformOptions: {
        enableImplicitConversion: true,
      },

      /**
       * Remove properties not declared in DTOs.
       */
      whitelist: true,

      /**
       * Reject requests containing unknown properties.
       */
      forbidNonWhitelisted: true,

      /**
       * Stop validation after the first constraint violation
       * for each property.
       */
      stopAtFirstError: true,

      /**
       * Prevent leaking the original payload.
       */
      validationError: {
        target: false,
        value: false,
      },

      /**
       * Produce a standardized validation exception.
       */
      exceptionFactory: (errors: ValidationError[]): BadRequestException => {
        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          code: ERROR_CODES.VALIDATION_ERROR,
          message: ValidationMessages.VALIDATION_FAILED,
          errors: this.formatErrors(errors),
        });
      },
    });
  }

  /**
   * Convert ValidationError objects into a simple,
   * frontend-friendly format.
   */
  private formatErrors(errors: ValidationError[]): Record<string, string[]> {
    const formatted: Record<string, string[]> = {};

    const traverse = (
      validationErrors: ValidationError[],
      parentPath = '',
    ): void => {
      for (const error of validationErrors) {
        const property = parentPath
          ? `${parentPath}.${error.property}`
          : error.property;

        if (error.constraints) {
          formatted[property] = Object.values(error.constraints);
        }

        if (error.children?.length) {
          traverse(error.children, property);
        }
      }
    };

    traverse(errors);

    return formatted;
  }
}
