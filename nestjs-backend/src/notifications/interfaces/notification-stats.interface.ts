/**
 * ============================================================================
 * File: notification-stats.interface.ts
 * ============================================================================
 *
 * Enterprise Notification Statistics Interface
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents aggregated notification statistics.
 * - Acts as the internal contract between Repository and Service.
 * - Used by NotificationsRepository for reporting and dashboard widgets.
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
 * - Mapper converts this interface into response DTOs.
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
 * - Add daily notification count.
 * - Add weekly notification count.
 * - Add monthly notification count.
 * - Add notification trend analytics.
 * - Add average notifications per day.
 * - Add notification response time metrics.
 * ============================================================================
 */

import { NotificationType } from '../../common/enums/notification-type.enum';

export interface NotificationStats {
  /**
   * Total active notifications.
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

  /**
   * Total soft-deleted notifications.
   */
  deleted: number;

  /**
   * Notification distribution by type.
   */
  byType: Array<{
    /**
     * Notification type.
     */
    type: NotificationType;

    /**
     * Number of notifications.
     */
    count: number;
  }>;
}
