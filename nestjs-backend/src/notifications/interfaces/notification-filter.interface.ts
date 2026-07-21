/**
 * ============================================================================
 * File: notification-filter.interface.ts
 * ============================================================================
 *
 * Enterprise Notification Filter Interface
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Defines the internal filtering contract for notification queries.
 * - Used between Controller → Service → Repository.
 * - Keeps filtering logic independent from HTTP and DTOs.
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
 * - Controllers convert NotificationQueryDto into this interface.
 * - Repository consumes this interface for QueryBuilder operations.
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
 * - Add search support.
 * - Add notification priority.
 * - Add archived filter.
 * - Add entityId/entityType filtering.
 * ============================================================================
 */

import { NotificationStatus } from '../../common/enums/notification-status.enum';
import { NotificationType } from '../../common/enums/notification-type.enum';

export interface NotificationFilter {
  /**
   * Authenticated user identifier.
   */
  userId: string;

  /**
   * Current page.
   */
  page?: number;

  /**
   * Records per page.
   */
  limit?: number;

  /**
   * Filter by notification status.
   */
  status?: NotificationStatus;

  /**
   * Filter by notification type.
   */
  type?: NotificationType;

  /**
   * Sort field.
   */
  sortBy?: 'title' | 'type' | 'status' | 'createdAt' | 'updatedAt';

  /**
   * Sort direction.
   */
  sortOrder?: 'ASC' | 'DESC';

  /**
   * Filter notifications created after this date.
   */
  startDate?: Date;

  /**
   * Filter notifications created before this date.
   */
  endDate?: Date;
}
