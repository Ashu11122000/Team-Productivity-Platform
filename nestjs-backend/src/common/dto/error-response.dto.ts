/**
 * ============================================================================
 * File: error-response.dto.ts
 * ============================================================================
 *
 * Enterprise Error Response DTO
 *
 * Responsibilities
 * ----------------
 * - Standardize API error response documentation.
 * - Represent the structure returned by the global exception filter.
 * - Improve Swagger/OpenAPI documentation.
 * - Provide a reusable error response contract.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - @nestjs/swagger
 * - TypeScript 5+
 * - Node.js 22+
 *
 * Standard Error Response
 * -----------------------
 * {
 *   "success": false,
 *   "statusCode": 404,
 *   "message": "Task not found.",
 *   "error": "Not Found",
 *   "timestamp": "2026-07-20T12:00:00.000Z",
 *   "path": "/api/v1/tasks/123",
 *   "requestId": "6a84bdf5-8f39-4d0c-90d7-71a0dfec8d24"
 * }
 *
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

/**
 * Standard API error response DTO.
 *
 * Mirrors the response returned by the global
 * AllExceptionsFilter.
 */
export class ErrorResponseDto {
  /**
   * Indicates whether the request was successful.
   */
  @ApiProperty({
    example: false,
    description: 'Indicates whether the request was successful.',
  })
  success!: false;

  /**
   * HTTP status code.
   */
  @ApiProperty({
    example: 404,
    description: 'HTTP status code.',
  })
  statusCode!: number;

  /**
   * Human-readable error message.
   */
  @ApiProperty({
    example: 'Task not found.',
    description: 'Human-readable error message.',
  })
  message!: string;

  /**
   * HTTP error name.
   */
  @ApiProperty({
    example: 'Not Found',
    description: 'HTTP error description.',
  })
  error!: string;

  /**
   * Timestamp when the error occurred.
   */
  @ApiProperty({
    example: '2026-07-20T12:00:00.000Z',
    description: 'ISO-8601 timestamp of the error.',
  })
  timestamp!: string;

  /**
   * Request path.
   */
  @ApiProperty({
    example: '/api/v1/tasks/123',
    description: 'Request path.',
  })
  path!: string;

  /**
   * Unique request identifier.
   */
  @ApiProperty({
    example: '6a84bdf5-8f39-4d0c-90d7-71a0dfec8d24',
    description: 'Unique request identifier for tracing.',
  })
  requestId!: string;
}
