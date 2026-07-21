/*
 * ============================================================================
 * File: index.ts
 * ============================================================================
 *
 * Shared Integration Barrel Export
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Export reusable integration contracts.
 * - Provide a single import point for shared types/interfaces.
 * - Hide internal folder structure.
 *
 *
 * Example:
 *
 * import {
 *   PaginationResult,
 *   TaskStatus,
 * } from '@/integrations/shared';
 *
 *
 * ============================================================================
 */

// ============================================================================
// Interfaces
// ============================================================================

export * from './interfaces/api.interface';

export * from './interfaces/base-entity.interface';

export * from './interfaces/pagination.interface';

// ============================================================================
// Types
// ============================================================================

export * from './types/activity.type';

export * from './types/category.type';

export * from './types/notification.type';

export * from './types/task.type';

export * from './types/user.type';
