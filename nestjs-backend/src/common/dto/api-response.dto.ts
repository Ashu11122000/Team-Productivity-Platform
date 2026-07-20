/**
 * ============================================================================
 * File: api-response.dto.ts
 * ============================================================================
 *
 * Enterprise API Response DTO
 *
 * Responsibilities
 * ----------------
 * - Standardize API responses across the application.
 * - Provide a consistent response contract.
 * - Improve Swagger documentation.
 * - Support generic response payloads.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - @nestjs/swagger
 * - TypeScript 5+
 * - Node.js 22+
 *
 * Standard Response Format
 * ------------------------
 * {
 *   "success": true,
 *   "message": "Task created successfully.",
 *   "data": { ... }
 * }
 *
 * Future Improvements
 * -------------------
 * - Add requestId.
 * - Add timestamp.
 * - Add metadata.
 * - Add pagination support.
 * - Add API version.
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

/**
 * Generic API response wrapper.
 *
 * @template T Type of the response payload.
 */
export class ApiResponseDto<T> {
  /**
   * Indicates whether the request was successful.
   */
  @ApiProperty({
    example: true,
    description: 'Indicates whether the request completed successfully.',
  })
  success!: boolean;

  /**
   * Human-readable response message.
   */
  @ApiProperty({
    example: 'Operation completed successfully.',
    description: 'Human-readable response message.',
  })
  message!: string;

  /**
   * Response payload.
   */
  @ApiProperty({
    description: 'Response payload.',
  })
  data!: T;
}
