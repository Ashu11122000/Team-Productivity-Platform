/**
 * ============================================================================
 * File: sanitize.pipe.ts
 * ============================================================================
 *
 * Enterprise Sanitize Pipe
 *
 * Responsibilities
 * ----------------
 * - Sanitize incoming string values.
 * - Remove invisible control characters.
 * - Normalize Unicode input.
 * - Normalize line endings.
 * - Collapse excessive whitespace.
 * - Trim surrounding whitespace.
 *
 * NOTE
 * ----
 * This pipe performs lightweight normalization only.
 * It is NOT intended for HTML/XSS sanitization.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 * ============================================================================
 */

import { Injectable, PipeTransform } from '@nestjs/common';

/**
 * Enterprise input sanitization pipe.
 */
@Injectable()
export class SanitizePipe implements PipeTransform {
  /**
   * Sanitize incoming value.
   *
   * @param value Incoming request value.
   * @returns Sanitized value.
   */
  transform<T>(value: T): T {
    if (typeof value !== 'string') {
      return value;
    }

    let sanitized = value as string;

    /**
     * ---------------------------------------------------------
     * Normalize Unicode representation.
     * ---------------------------------------------------------
     */
    sanitized = sanitized.normalize('NFC');

    /**
     * ---------------------------------------------------------
     * Normalize line endings.
     *
     * CRLF (\r\n)
     * CR   (\r)
     *
     * ->
     *
     * LF (\n)
     * ---------------------------------------------------------
     */
    sanitized = sanitized.replace(/\r\n?/g, '\n');

    /**
     * ---------------------------------------------------------
     * Remove ASCII control characters.
     *
     * Preserves:
     *   - Horizontal Tab (\t)
     *   - Line Feed (\n)
     *
     * Removes:
     *   - NULL
     *   - BEL
     *   - ESC
     *   - DEL
     *   - Other non-printable ASCII control characters
     * ---------------------------------------------------------
     */
    sanitized = [...sanitized]
      .filter((character) => {
        const code = character.charCodeAt(0);

        return (
          code === 9 || // Tab
          code === 10 || // Line Feed
          code >= 32 // Printable ASCII + Unicode
        );
      })
      .join('');

    /**
     * ---------------------------------------------------------
     * Collapse multiple spaces/tabs.
     *
     * Preserves newlines.
     * ---------------------------------------------------------
     */
    sanitized = sanitized.replace(/[ \t]+/g, ' ');

    /**
     * ---------------------------------------------------------
     * Trim surrounding whitespace.
     * ---------------------------------------------------------
     */
    sanitized = sanitized.trim();

    return sanitized as T;
  }
}
