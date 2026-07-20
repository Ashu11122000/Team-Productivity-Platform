/**
 * ============================================================================
 * File: pagination.pipe.ts
 * ============================================================================
 *
 * Enterprise Pagination Pipe
 *
 * Responsibilities
 * ----------------
 * - Validate pagination query parameters.
 * - Apply default pagination values.
 * - Enforce configured limits.
 * - Normalize sort direction.
 * - Return a strongly typed pagination object.
 *
 * Why use this pipe?
 * ------------------
 * Instead of repeatedly doing:
 *
 * const page = Number(query.page) || 1;
 * const limit = Math.min(Number(query.limit) || 20, 100);
 *
 * every controller can simply use:
 *
 * @Query(PaginationPipe)
 * pagination: PaginationQuery
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 *
 * Future Improvements
 * -------------------
 * - Cursor pagination.
 * - Multi-column sorting.
 * - Configurable whitelist of sortable fields.
 * - Offset-based pagination.
 * ============================================================================
 */

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { ERROR_CODES, PAGINATION_CONSTANTS } from '../constants';
import { ValidationMessages } from './../messages/validation.messages';

/**
 * Normalized pagination object returned by the pipe.
 */
export interface PaginationQuery {
  /**
   * Current page.
   */
  page: number;

  /**
   * Records per page.
   */
  limit: number;

  /**
   * Offset for database queries.
   */
  skip: number;

  /**
   * Maximum records.
   */
  take: number;

  /**
   * Sort direction.
   */
  order: 'ASC' | 'DESC';

  /**
   * Optional sort field.
   */
  sortBy?: string;
}

/**
 * Enterprise pagination pipe.
 */
@Injectable()
export class PaginationPipe implements PipeTransform<
  Record<string, unknown>,
  PaginationQuery
> {
  transform(query: Record<string, unknown>): PaginationQuery {
    const page = this.parsePositiveInteger(
      query.page,
      PAGINATION_CONSTANTS.DEFAULT_PAGE,
    );

    const limit = this.parsePositiveInteger(
      query.limit,
      PAGINATION_CONSTANTS.DEFAULT_LIMIT,
    );

    const normalizedLimit = Math.min(limit, PAGINATION_CONSTANTS.MAX_LIMIT);

    const sortBy =
      typeof query.sortBy === 'string' ? query.sortBy.trim() : undefined;

    const order = this.parseSortOrder(query.order);

    return {
      page,
      limit: normalizedLimit,
      skip: (page - 1) * normalizedLimit,
      take: normalizedLimit,
      sortBy,
      order,
    };
  }

  /**
   * Parse positive integer values.
   */
  private parsePositiveInteger(value: unknown, defaultValue: number): number {
    if (value === undefined || value === null || value === '') {
      return defaultValue;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < PAGINATION_CONSTANTS.MIN_PAGE) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        code: ERROR_CODES.VALIDATION_ERROR,
        message: ValidationMessages.INVALID_PAGINATION,
      });
    }

    return parsed;
  }

  /**
   * Normalize sort direction.
   */
  private parseSortOrder(value: unknown): 'ASC' | 'DESC' {
    if (typeof value !== 'string') {
      return PAGINATION_CONSTANTS.DEFAULT_ORDER;
    }

    const normalized = value.trim().toUpperCase();

    if (normalized === 'ASC' || normalized === 'DESC') {
      return normalized;
    }

    throw new BadRequestException({
      statusCode: 400,
      error: 'Bad Request',
      code: ERROR_CODES.VALIDATION_ERROR,
      message: ValidationMessages.INVALID_SORT_ORDER,
    });
  }
}
