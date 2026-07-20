/**
 * ============================================================================
 * File: notification.messages.ts
 * ============================================================================
 *
 * Notification-related application messages.
 *
 * Responsibilities
 * ----------------
 * - Centralize notification messages.
 * - Standardize notification responses.
 * - Support notification lifecycle operations.
 * - Support future integrations.
 *
 * Used By
 * -------
 * - Notifications Module
 * - Tasks Module
 * - Reminders Module
 * - Scheduler Jobs
 * - Activity Logs
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM
 * - Scheduler
 * ============================================================================
 */

/**
 * ============================================================================
 * Notification Success Messages
 * ============================================================================
 */
export const NotificationSuccessMessages = {
  /**
   * Creation
   */
  CREATED: 'Notification created successfully.',

  /**
   * Retrieval
   */
  FOUND: 'Notification retrieved successfully.',

  LIST_FETCHED: 'Notifications retrieved successfully.',

  /**
   * Status
   */
  MARKED_AS_READ: 'Notification marked as read.',

  MARKED_AS_UNREAD: 'Notification marked as unread.',

  ALL_MARKED_AS_READ: 'All notifications marked as read.',

  /**
   * Deletion
   */
  DELETED: 'Notification deleted successfully.',

  CLEARED: 'Notifications cleared successfully.',

  /**
   * Delivery
   */
  SENT: 'Notification sent successfully.',
} as const;

/**
 * ============================================================================
 * Notification Error Messages
 * ============================================================================
 */
export const NotificationErrorMessages = {
  /**
   * Lookup
   */
  NOT_FOUND: 'Notification not found.',

  INVALID_ID: 'Invalid notification identifier.',

  /**
   * Operations
   */
  CREATE_FAILED: 'Unable to create notification.',

  SEND_FAILED: 'Unable to send notification.',

  DELETE_FAILED: 'Unable to delete notification.',

  /**
   * Status
   */
  ALREADY_READ: 'Notification has already been read.',

  ALREADY_DELETED: 'Notification has already been deleted.',

  INVALID_STATUS: 'Invalid notification status.',

  /**
   * Permissions
   */
  ACCESS_DENIED: 'You do not have permission to access this notification.',

  /**
   * User relationship
   */
  USER_NOT_FOUND: 'Notification recipient was not found.',
} as const;

/**
 * ============================================================================
 * Notification Validation Messages
 * ============================================================================
 */
export const NotificationValidationMessages = {
  TITLE_REQUIRED: 'Notification title is required.',

  MESSAGE_REQUIRED: 'Notification message is required.',

  INVALID_TYPE: 'Invalid notification type.',

  INVALID_CHANNEL: 'Invalid notification channel.',

  INVALID_PRIORITY: 'Invalid notification priority.',
} as const;

/**
 * ============================================================================
 * Notification Type Messages
 * ============================================================================
 *
 * Used for notification categories.
 */
export const NotificationTypeMessages = {
  TASK_ASSIGNED: 'A task has been assigned to you.',

  TASK_COMPLETED: 'A task has been completed.',

  TASK_UPDATED: 'A task has been updated.',

  TASK_DUE_SOON: 'A task deadline is approaching.',

  REMINDER: 'You have a pending reminder.',

  SYSTEM: 'System notification.',
} as const;

/**
 * ============================================================================
 * Notification Channel Messages
 * ============================================================================
 *
 * Future support:
 * - In-app
 * - Email
 * - Push
 * - SMS
 */
export const NotificationChannelMessages = {
  IN_APP: 'In-app notification.',

  EMAIL: 'Email notification.',

  PUSH: 'Push notification.',

  SMS: 'SMS notification.',
} as const;

/**
 * ============================================================================
 * Notification Delivery Messages
 * ============================================================================
 */
export const NotificationDeliveryMessages = {
  QUEUED: 'Notification queued successfully.',

  PROCESSING: 'Notification delivery is being processed.',

  DELIVERED: 'Notification delivered successfully.',

  FAILED: 'Notification delivery failed.',

  RETRYING: 'Retrying notification delivery.',
} as const;

/**
 * ============================================================================
 * Notification Integration Messages
 * ============================================================================
 *
 * Used by future external providers.
 */
export const NotificationIntegrationMessages = {
  EMAIL_PROVIDER_FAILED: 'Email notification provider failed.',

  PUSH_PROVIDER_FAILED: 'Push notification provider failed.',

  SMS_PROVIDER_FAILED: 'SMS notification provider failed.',

  EXTERNAL_SERVICE_TIMEOUT: 'Notification provider timed out.',
} as const;

/**
 * ============================================================================
 * Notification Scheduler Messages
 * ============================================================================
 *
 * Used by jobs/reminders.
 */
export const NotificationSchedulerMessages = {
  JOB_STARTED: 'Notification scheduler job started.',

  JOB_COMPLETED: 'Notification scheduler job completed.',

  JOB_FAILED: 'Notification scheduler job failed.',

  REMINDER_TRIGGERED: 'Reminder notification triggered.',
} as const;
