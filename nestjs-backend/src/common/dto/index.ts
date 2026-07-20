/**
 * ============================================================================
 * File: index.ts
 * ============================================================================
 *
 * DTO Barrel Exports
 *
 * Responsibilities
 * ----------------
 * - Provide a single entry point for all shared DTOs.
 * - Simplify imports throughout the application.
 * - Reduce import path duplication.
 * - Improve maintainability and scalability.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * - Node.js 22+
 *
 * Example
 * -------
 * Instead of:
 *
 * import { ApiResponseDto } from './dto/api-response.dto';
 * import { PaginationQueryDto } from './dto/pagination-query.dto';
 * import { PaginationResponseDto } from './dto/pagination-response.dto';
 *
 * simply use:
 *
 * import {
 *   ApiResponseDto,
 *   ErrorResponseDto,
 *   PaginationQueryDto,
 *   PaginationResponseDto,
 * } from './dto';
 * ============================================================================
 */

/**
 * --------------------------------------------------------------------------
 * API Response DTOs
 * --------------------------------------------------------------------------
 */

export * from './api-response.dto';
export * from './error-response.dto';

/**
 * --------------------------------------------------------------------------
 * Pagination DTOs
 * --------------------------------------------------------------------------
 */

export * from './pagination-query.dto';
export * from './pagination-response.dto';
