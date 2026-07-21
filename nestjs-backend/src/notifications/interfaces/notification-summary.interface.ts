/**
 * ============================================================================
 * File: notification-summary.interface.ts
 * ============================================================================
 *
 * Enterprise Notification Summary Interface
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents the aggregated notification summary returned by the repository.
 * - Acts as the internal business contract between Repository and Service.
 * - Remains independent of DTOs, HTTP, and persistence concerns.
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
 * - This interface is NOT exposed directly to API consumers.
 * - Repository implementations populate this interface.
 * - Mapper converts this interface into NotificationSummaryDto.
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
 * - Add notification type statistics.
 * - Add archived notification count.
 * - Add daily notification summary.
 * - Add weekly notification summary.
 * - Add monthly notification summary.
 * ============================================================================
 */

export interface NotificationSummary {
  /**
   * Total notifications.
   */
  total: number;

  /**
   * Total unread notifications.
   */
  unread: number;

  /**
   * Total read notifications.
   */
  read: number;
}
