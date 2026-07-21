/**
 * ============================================================================
 * File: activity-log.entity.ts
 * ============================================================================
 *
 * Activity Log Entity.
 *
 * Responsibilities
 * ----------------
 * - Represents an immutable audit log entry.
 * - Stores user activity for auditing and history.
 * - Maps the Activity Log domain model to PostgreSQL.
 *
 * Notes
 * -----
 * Activity logs are append-only records.
 * Existing entries should never be updated or deleted through
 * normal application workflows.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 * - Node.js 22+
 * ============================================================================
 */

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ActivityAction, ActivityEntityType } from '../../common/enums';

/**
 * ============================================================================
 * Activity Log Entity
 * ============================================================================
 */
@Entity({
  name: 'activity_logs',
  comment: 'Stores immutable user activity logs.',
})
@Index('IDX_ACTIVITY_USER_ID', ['userId'])
@Index('IDX_ACTIVITY_ACTION', ['action'])
@Index('IDX_ACTIVITY_ENTITY_TYPE', ['entityType'])
@Index('IDX_ACTIVITY_ENTITY_ID', ['entityId'])
export class ActivityLog {
  /**
   * --------------------------------------------------------------------------
   * Primary Key
   * --------------------------------------------------------------------------
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * --------------------------------------------------------------------------
   * Activity Action
   * --------------------------------------------------------------------------
   */
  @Column({
    type: 'enum',
    enum: ActivityAction,
    enumName: 'activity_action_enum',
  })
  action!: ActivityAction;

  /**
   * --------------------------------------------------------------------------
   * Entity Type
   * --------------------------------------------------------------------------
   */
  @Column({
    type: 'enum',
    enum: ActivityEntityType,
    enumName: 'activity_entity_type_enum',
  })
  entityType!: ActivityEntityType;

  /**
   * --------------------------------------------------------------------------
   * Entity Identifier
   * --------------------------------------------------------------------------
   */
  @Column({
    type: 'uuid',
  })
  entityId!: string;

  /**
   * --------------------------------------------------------------------------
   * Metadata
   * --------------------------------------------------------------------------
   *
   * Additional contextual information related to the activity.
   * Stored as JSONB for efficient querying.
   */
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadata?: Record<string, unknown> | null;

  /**
   * --------------------------------------------------------------------------
   * User Identifier
   * --------------------------------------------------------------------------
   *
   * Identifier received from the FastAPI authentication service.
   */
  @Column({
    type: 'varchar',
    length: 100,
  })
  userId!: string;

  /**
   * --------------------------------------------------------------------------
   * Created At
   * --------------------------------------------------------------------------
   */
  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt!: Date;
}
