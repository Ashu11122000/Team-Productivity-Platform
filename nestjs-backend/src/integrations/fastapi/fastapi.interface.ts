/*
 * ============================================================================
 * File: fastapi.interface.ts
 * ============================================================================
 *
 * FastAPI Integration Interfaces
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define FastAPI API contracts.
 * - Describe external response structures.
 * - Provide type safety between client and service.
 *
 * Does NOT:
 * ----------------------------------------------------------------------------
 * - Contain validation.
 * - Contain business rules.
 * - Access databases.
 *
 *
 * Architecture:
 *
 * FastAPI
 *    |
 *    ↓
 * FastApiClient
 *    |
 *    ↓
 * Interfaces
 *    |
 *    ↓
 * FastApiService
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
// Generic FastAPI Response Wrapper
// ============================================================================

export interface FastApiResponse<T> {
  /**
   * Response data.
   */
  data: T;

  /**
   * Optional message.
   */
  message?: string;

  /**
   * Request success status.
   */
  success?: boolean;
}

// ============================================================================
// FastAPI User Contract
// ============================================================================

export interface FastApiUser {
  /**
   * User identifier.
   *
   * Comes from FastAPI database.
   */
  id: string;

  email: string;

  username: string;

  firstName?: string;

  lastName?: string;

  avatar?: string;

  isActive: boolean;

  createdAt?: string;

  updatedAt?: string;
}

// ============================================================================
// Authenticated User Contract
// ============================================================================

export interface FastApiAuthenticatedUser {
  user: FastApiUser;

  accessToken?: string;

  refreshToken?: string;
}

// ============================================================================
// JWT Validation Response
// ============================================================================

export interface FastApiTokenValidationResponse {
  valid: boolean;

  user?: FastApiUser;

  expiresAt?: number;

  message?: string;
}

// ============================================================================
// User Profile Response
// ============================================================================

export interface FastApiProfileResponse {
  id: string;

  email: string;

  username: string;

  firstName?: string;

  lastName?: string;

  avatar?: string;
}

// ============================================================================
// Pagination Contract
// ============================================================================

export interface FastApiPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

// ============================================================================
// Paginated Response
// ============================================================================

export interface FastApiPaginatedResponse<T> {
  items: T[];

  pagination: FastApiPagination;
}

// ============================================================================
// Error Response
// ============================================================================

export interface FastApiErrorResponse {
  statusCode: number;

  message: string;

  error?: string;

  timestamp?: string;

  path?: string;
}
