/*
 * ============================================================================
 * File: reminder.entity.ts
 * ============================================================================
 *
 * Enterprise Reminder Entity
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents reminder persistence in PostgreSQL.
 * - Stores scheduling information for user reminders.
 * - Supports recurring reminders.
 * - Supports soft deletion.
 * - Supports dashboard and analytics aggregations.
 * - Maintains ownership through userId.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Persistence model only
 * - No business logic
 * - Database optimized
 * - Strong typing
 * - PostgreSQL friendly
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - FastAPI remains responsible for authentication.
 * - NestJS validates JWTs and resolves the authenticated user.
 * - Services enforce ownership and business rules.
 * - Controllers never expose this entity directly.
 * - Entity → DTO transformation is handled exclusively by ReminderMapper.
 *
 * ============================================================================
 */

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ReminderRepeat } from '../enums/reminder-repeat.enum';
import { ReminderStatus } from '../enums/reminder-status.enum';
import { ReminderType } from '../enums/reminder-type.enum';

/**
 * ============================================================================
 * Reminder Entity
 * ============================================================================
 */
@Entity({
  name: 'reminders',
})
@Index('IDX_REMINDER_USER', ['userId'])
@Index('IDX_REMINDER_STATUS', ['status'])
@Index('IDX_REMINDER_TYPE', ['type'])
@Index('IDX_REMINDER_REPEAT', ['repeat'])
export class ReminderEntity {
  /**
   * Unique reminder identifier.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Owner of the reminder.
   *
   * Authentication is handled by FastAPI.
   * NestJS validates the JWT and uses the authenticated user's ID.
   */
  @Column({
    type: 'uuid',
  })
  userId!: string;

  /**
   * Reminder title.
   */
  @Column({
    type: 'varchar',
    length: 150,
  })
  title!: string;

  /**
   * Optional reminder description.
   */
  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string | null;

  /**
   * Business reminder type.
   */
  @Column({
    type: 'enum',
    enum: ReminderType,
    default: ReminderType.GENERAL,
  })
  type!: ReminderType;

  /**
   * Current reminder lifecycle status.
   */
  @Column({
    type: 'enum',
    enum: ReminderStatus,
    default: ReminderStatus.PENDING,
  })
  status!: ReminderStatus;

  /**
   * Reminder recurrence configuration.
   */
  @Column({
    type: 'enum',
    enum: ReminderRepeat,
    default: ReminderRepeat.NONE,
  })
  repeat!: ReminderRepeat;

  /**
   * Date and time when the reminder should be triggered.
   */
  @Column({
    type: 'timestamptz',
  })
  remindAt!: Date;

  /**
   * Date and time when the reminder was actually triggered.
   *
   * Null until the reminder has been executed.
   */
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  triggeredAt?: Date | null;

  /**
   * Date and time when the reminder was completed.
   *
   * Applicable for reminders that require user action.
   */
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  completedAt?: Date | null;

  /**
   * Number of minutes before remindAt when the reminder
   * should be triggered.
   */
  @Column({
    type: 'integer',
    default: 0,
  })
  reminderOffsetMinutes!: number;

  /**
   * Whether an in-app notification should be generated
   * when this reminder is triggered.
   */
  @Column({
    type: 'boolean',
    default: true,
  })
  sendNotification!: boolean;

  /**
   * Whether an email notification should be sent
   * when this reminder is triggered.
   */
  @Column({
    type: 'boolean',
    default: false,
  })
  sendEmail!: boolean;

  /**
   * Optional related task identifier.
   *
   * Used for reminders associated with tasks.
   */
  @Column({
    type: 'uuid',
    nullable: true,
  })
  taskId?: string | null;

  /**
   * Optional related notification identifier.
   *
   * Allows integration with the Notifications module.
   */
  @Column({
    type: 'uuid',
    nullable: true,
  })
  notificationId?: string | null;

  /**
   * Additional reminder metadata.
   *
   * Stores optional module-specific information without
   * requiring schema changes.
   */
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadata?: Record<string, unknown> | null;

  /**
   * Timestamp when the reminder was created.
   */
  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt!: Date;

  /**
   * Timestamp when the reminder was last updated.
   */
  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt!: Date;

  /**
   * Timestamp when the reminder was soft deleted.
   *
   * A null value indicates that the reminder is active.
   */
  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt?: Date | null;
}

/**
 * ============================================================================
 * PostgreSQL Index Strategy
 * ============================================================================
 *
 * The following indexes are defined to optimize the most common repository
 * queries executed by the Reminders module:
 *
 * • IDX_REMINDER_USER
 *     - Fetch reminders belonging to an authenticated user.
 *
 * • IDX_REMINDER_STATUS
 *     - Filter reminders by lifecycle status.
 *
 * • IDX_REMINDER_TYPE
 *     - Filter reminders by business type.
 *
 * • IDX_REMINDER_REPEAT
 *     - Filter recurring reminders.
 *
 * Additional indexes recommended for production workloads:
 *
 * @Index('IDX_REMINDER_REMIND_AT', ['remindAt'])
 *      Optimizes:
 *      - Upcoming reminders
 *      - Due reminders
 *      - Scheduler polling
 *
 * @Index('IDX_REMINDER_TASK', ['taskId'])
 *      Optimizes lookups by related task.
 *
 * @Index('IDX_REMINDER_NOTIFICATION', ['notificationId'])
 *      Optimizes lookups by related notification.
 *
 * @Index('IDX_REMINDER_USER_REMIND_AT', ['userId', 'remindAt'])
 *      Optimizes:
 *      - Dashboard widgets
 *      - Calendar views
 *      - Upcoming reminders
 *      - Today's reminders
 *
 * @Index('IDX_REMINDER_USER_STATUS', ['userId', 'status'])
 *      Optimizes:
 *      - Summary queries
 *      - Statistics
 *      - Dashboard aggregations
 *
 * ============================================================================
 */
