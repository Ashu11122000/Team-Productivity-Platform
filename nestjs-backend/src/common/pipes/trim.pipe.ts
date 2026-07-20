/**
 * ============================================================================
 * File: trim.pipe.ts
 * ============================================================================
 *
 * Enterprise Trim Pipe
 *
 * Responsibilities
 * ----------------
 * - Remove leading and trailing whitespace from string values.
 * - Normalize incoming request data.
 * - Prevent accidental whitespace from being stored in the database.
 * - Keep controllers and services free from repetitive .trim() calls.
 *
 * Why use this pipe?
 * ------------------
 * Instead of:
 *
 * dto.title = dto.title.trim();
 * dto.email = dto.email.trim();
 * dto.name = dto.name.trim();
 *
 * simply use:
 *
 * @Body('title', TrimPipe)
 * title: string
 *
 * or combine with DTO validation for cleaner request handling.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 *
 * Future Improvements
 * -------------------
 * - Optional collapse of multiple consecutive spaces.
 * - Optional lowercase transformation.
 * - Optional uppercase transformation.
 * - Optional HTML sanitization integration.
 * ============================================================================
 */

import { Injectable, PipeTransform } from '@nestjs/common';

/**
 * Enterprise trim pipe.
 *
 * Removes leading and trailing whitespace from string values while
 * leaving all other value types unchanged.
 */
@Injectable()
export class TrimPipe implements PipeTransform {
  /**
   * Normalize incoming value.
   *
   * @param value Incoming request value.
   * @returns Trimmed string or original value.
   */
  transform<T>(value: T): T {
    if (typeof value !== 'string') {
      return value;
    }

    return value.trim() as T;
  }
}
