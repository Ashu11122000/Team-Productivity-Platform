/***
 * ============================================================================
 * File: dashboard-filter.interface.ts
 * ============================================================================
 *
 * Enterprise Dashboard Filter Interface
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Defines the internal filtering contract for dashboard queries.
 * - Used between the Controller, Service, and Repository layers.
 * - Keeps business logic independent from HTTP-specific DTOs.
 * - Represents validated filter criteria after DTO transformation.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Interface Segregation Principle (ISP)
 * - Clean Architecture
 * - Strong Typing
 * - Framework Agnostic
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Controllers should convert DashboardQueryDto into this interface.
 * - Services consume this interface for business logic.
 * - Repositories use this interface to build QueryBuilder filters.
 * - This interface must never contain validation decorators.
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - TypeScript 5+
 * - TypeORM 0.3+
 *
 * Future Enhancements
 * ----------------------------------------------------------------------------
 * TODO:
 * - Add support for user-defined dashboard widgets.
 * - Add timezone-aware date filtering.
 * - Add organization/team filtering.
 * - Add tag-based filtering.
 * ============================================================================
 */

export interface DashboardFilter {
  /**
   * Authenticated user identifier.
   * Used to scope dashboard data ownership.
   */
  userId: string;

  /**
   * Dashboard start date.
   */
  startDate?: Date;

  /**
   * Dashboard end date.
   */
  endDate?: Date;

  /**
   * Filter by category.
   */
  categoryId?: string;

  /**
   * Filter completed tasks.
   */
  completed?: boolean;

  /**
   * Filter overdue tasks.
   */
  overdue?: boolean;

  /**
   * Defines the aggregation interval for productivity trends.
   */
  groupBy?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}
