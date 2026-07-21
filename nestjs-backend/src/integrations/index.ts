/*
 * ============================================================================
 * File: index.ts
 * ============================================================================
 *
 * Enterprise Integrations Barrel Export
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Provide single entry point for all integrations.
 * - Expose external service clients.
 * - Expose integration services.
 * - Expose shared contracts.
 *
 *
 * Example:
 *
 * import {
 *   FastApiService,
 *   HolidayApiService,
 *   PaginationResult,
 * } from '@/integrations';
 *
 *
 * ============================================================================
 */

// ============================================================================
// FastAPI Integration
// ============================================================================

export * from './fastapi';

// ============================================================================
// Holiday Integration
// ============================================================================

export * from './holidays';

// ============================================================================
// Shared Integration Contracts
// ============================================================================

export * from './shared';
