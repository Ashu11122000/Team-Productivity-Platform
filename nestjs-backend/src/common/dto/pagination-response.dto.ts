/**
 * ============================================================================
 * File: pagination-response.dto.ts
 * ============================================================================
 *
 * Enterprise Pagination Response DTO
 *
 * Responsibilities
 * ----------------
 * - Standardize paginated API responses.
 * - Provide consistent pagination metadata.
 * - Support generic response types.
 * - Improve Swagger documentation.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - @nestjs/swagger
 * - TypeScript 5+
 * - Node.js 22+
 *
 * Example Response
 * ----------------
 * {
 *   "data": [...],
 *   "page": 1,
 *   "limit": 10,
 *   "total": 57,
 *   "totalPages": 6
 * }
 *
 * Future Improvements
 * -------------------
 * - Add hasNextPage.
 * - Add hasPreviousPage.
 * - Add nextPage.
 * - Add previousPage.
 * - Add links for HATEOAS if required.
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

/**
 * Generic DTO representing a paginated API response.
 *
 * @template T Entity type contained in the response.
 */
export class PaginationResponseDto<T> {
  /**
   * Collection of returned items.
   */
  @ApiProperty({
    description: 'Collection of returned resources.',
    isArray: true,
  })
  data!: T[];

  /**
   * Current page number.
   */
  @ApiProperty({
    example: 1,
    description: 'Current page number.',
  })
  page!: number;

  /**
   * Number of items per page.
   */
  @ApiProperty({
    example: 10,
    description: 'Maximum number of items per page.',
  })
  limit!: number;

  /**
   * Total number of records.
   */
  @ApiProperty({
    example: 57,
    description: 'Total number of available records.',
  })
  total!: number;

  /**
   * Total number of available pages.
   */
  @ApiProperty({
    example: 6,
    description: 'Total number of pages.',
  })
  totalPages!: number;
}
