/*
 * ============================================================================
 * File: api.interface.ts
 * ============================================================================
 *
 * Shared API Integration Interfaces
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define common API response contracts.
 * - Standardize responses from external services.
 * - Provide reusable integration-level interfaces.
 *
 * Used By:
 * ----------------------------------------------------------------------------
 * - FastAPI Integration
 * - Holiday Integration
 * - Future external APIs
 *
 * Does NOT:
 * ----------------------------------------------------------------------------
 * - Contain business logic.
 * - Perform validation.
 * - Handle HTTP requests.
 *
 *
 * Architecture:
 *
 * External API
 *      |
 *      ↓
 * Integration Client
 *      |
 *      ↓
 * ApiResponse<T>
 *      |
 *      ↓
 * Integration Service
 *
 *
 * Compatible:
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - TypeScript 5+
 *
 * ============================================================================
 */

// ============================================================================
// Generic API Response
// ============================================================================

export interface ApiResponse<T> {
  /**
   * Indicates whether request succeeded.
   */
  success: boolean;

  /**
   * Response payload.
   */
  data: T;

  /**
   * Optional response message.
   */
  message?: string;

  /**
   * Optional timestamp from provider.
   */
  timestamp?: string;
}

// ============================================================================
// Paginated API Response
// ============================================================================

export interface PaginatedApiResponse<T> {
  /**
   * Indicates request status.
   */
  success: boolean;

  /**
   * Returned records.
   */
  data: T[];

  /**
   * Pagination metadata.
   */
  pagination: {
    page: number;

    limit: number;

    total: number;

    totalPages: number;
  };

  /**
   * Optional response message.
   */
  message?: string;
}

// ============================================================================
// API Error Response
// ============================================================================

export interface ApiErrorResponse {
  /**
   * HTTP status code.
   */
  statusCode: number;

  /**
   * Error message.
   */
  message: string;

  /**
   * Error identifier.
   */
  error?: string;

  /**
   * API request path.
   */
  path?: string;

  /**
   * Error timestamp.
   */
  timestamp?: string;
}

// ============================================================================
// API Request Metadata
// ============================================================================
//
// Used for tracing and observability.
//
// Example:
// - correlationId
// - requestId
//
// ============================================================================

export interface ApiRequestMetadata {
  /**
   * Request correlation identifier.
   */
  correlationId?: string;

  /**
   * Source service name.
   */
  service?: string;

  /**
   * Request timestamp.
   */
  timestamp?: string;
}
