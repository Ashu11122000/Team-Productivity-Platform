/**
 * ============================================================================
 * File: features/notifications/types/notification-restore.types.ts
 * ============================================================================
 *
 * Notification Restore Types
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Define restore notification response contracts.
 * - Mirror NestJS restore notification DTO responses.
 * - Provide typed restore mutation responses.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Notifications are managed by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

/**
 * ============================================================================
 * Notification Restore Response
 * ============================================================================
 */

export interface NotificationRestoreResponse {
  /**
   * Indicates whether the operation succeeded.
   */
  readonly success: boolean;

  /**
   * Backend response message.
   */
  readonly message: string;
}
