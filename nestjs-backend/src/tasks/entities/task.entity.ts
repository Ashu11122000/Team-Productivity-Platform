/**
 * ============================================================================
 * File: task.entity.ts
 * ============================================================================
 *
 * Task persistence entity.
 *
 * Responsibilities
 * ----------------
 * - Represent the "tasks" database table.
 * - Define task persistence metadata.
 * - Configure database relationships.
 * - Configure indexes for high-performance queries.
 * - Remain free of business logic.
 *
 * Architecture
 * ------------
 * Controller
 *      │
 *      ▼
 * Service
 *      │
 *      ▼
 * Repository
 *      │
 *      ▼
 * TaskEntity
 *      │
 *      ▼
 * PostgreSQL
 *
 * Notes
 * -----
 * - Authentication is owned by the FastAPI backend.
 * - userId stores the authenticated user's identifier from the validated JWT.
 * - This entity should never be returned directly from controllers.
 * - Controllers must always return mapped Response DTOs.
 *
 * Compatible With
 * ---------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from '../../categories/entities/category.entity';
import { TaskPriority } from '../../common/enums/task-priority.enum';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { Tag } from '../../tags/entities/tag.entity';

/**
 * Task database entity.
 *
 * Represents a task assigned to a specific authenticated user.
 */
@Entity({
  name: 'tasks',
})
@Index('IDX_TASK_USER_STATUS', ['userId', 'status'])
export class TaskEntity {
  /**
   * Unique task identifier.
   */
  @ApiProperty({
    description: 'Unique identifier of the task.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Human-readable task title.
   */
  @ApiProperty({
    description: 'Title of the task.',
    example: 'Complete NestJS Tasks Module',
    maxLength: 255,
  })
  @Index('IDX_TASK_TITLE')
  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Task title displayed to the user.',
  })
  title!: string;

  /**
   * Optional task description.
   */
  @ApiProperty({
    description: 'Detailed description of the task.',
    example:
      'Implement the enterprise Repository Pattern for the Tasks module.',
    required: false,
    nullable: true,
  })
  @Column({
    type: 'text',
    nullable: true,
    comment: 'Optional detailed description of the task.',
  })
  description?: string | null;

  /**
   * Current workflow status.
   *
   * Used by dashboards, analytics, filters, and task lifecycle
   * management throughout the application.
   */
  @ApiProperty({
    description: 'Current workflow status of the task.',
    enum: TaskStatus,
    example: TaskStatus.TODO,
    default: TaskStatus.TODO,
  })
  @Index('IDX_TASK_STATUS')
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
    comment: 'Current workflow status of the task.',
  })
  status!: TaskStatus;

  /**
   * Task priority.
   *
   * Used for:
   * - Dashboard sorting
   * - Analytics
   * - Reminder scheduling
   * - Future notification prioritization
   */
  @ApiProperty({
    description: 'Priority level assigned to the task.',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
    default: TaskPriority.MEDIUM,
  })
  @Index('IDX_TASK_PRIORITY')
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    comment: 'Priority level of the task.',
  })
  priority!: TaskPriority;

  /**
   * Scheduled due date.
   *
   * Null indicates that no due date has been assigned.
   */
  @ApiProperty({
    description: 'Scheduled due date of the task.',
    example: '2026-06-20T18:00:00.000Z',
    required: false,
    nullable: true,
    type: String,
    format: 'date-time',
  })
  @Index('IDX_TASK_DUE_DATE')
  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: 'Optional due date of the task.',
  })
  dueDate?: Date | null;

  /**
   * Completion timestamp.
   *
   * This value is populated only when the task reaches
   * the COMPLETED status.
   *
   * Analytics uses this field for:
   * - Daily productivity
   * - Weekly productivity
   * - Monthly productivity
   * - Completion trends
   * - Completion rate calculations
   */
  @ApiProperty({
    description: 'Timestamp when the task was completed.',
    example: '2026-06-18T15:45:00.000Z',
    required: false,
    nullable: true,
    type: String,
    format: 'date-time',
  })
  @Index('IDX_TASK_COMPLETED_AT')
  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: 'Timestamp when the task was marked as completed.',
  })
  completedAt?: Date | null;

  /**
   * Reminder timestamp.
   *
   * Reserved for the future Reminders module.
   */
  @ApiProperty({
    description: 'Scheduled reminder time for this task.',
    example: '2026-06-19T09:00:00.000Z',
    required: false,
    nullable: true,
    type: String,
    format: 'date-time',
  })
  @Index('IDX_TASK_REMINDER_AT')
  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: 'Optional reminder timestamp.',
  })
  reminderAt?: Date | null;

  /**
   * Estimated effort.
   *
   * Represents the estimated amount of work required
   * to complete the task.
   *
   * Stored in minutes to simplify reporting,
   * workload calculations, and analytics.
   */
  @ApiProperty({
    description: 'Estimated effort required to complete the task (minutes).',
    example: 120,
    required: false,
    nullable: true,
    minimum: 1,
  })
  @Column({
    type: 'integer',
    nullable: true,
    unsigned: true,
    comment: 'Estimated duration in minutes.',
  })
  estimatedMinutes?: number | null;

  /**
   * Owner of the task.
   *
   * This value originates from the validated JWT issued by the
   * FastAPI authentication service.
   *
   * Every task belongs to exactly one authenticated user.
   */
  @ApiProperty({
    description: 'Authenticated user identifier.',
    example: '550e8400-e29b-41d4-a716-446655440099',
  })
  @Index('IDX_TASK_USER_ID')
  @Column({
    type: 'varchar',
    length: 100,
    comment: 'User identifier received from the FastAPI JWT.',
  })
  userId!: string;

  /**
   * Indicates whether this task originated from a converted note.
   *
   * Used for:
   * - Note → Task conversion
   * - Analytics
   * - Activity Logs
   */
  @ApiProperty({
    description: 'Whether the task was created from a note.',
    example: false,
    default: false,
  })
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indicates whether the task originated from a converted note.',
  })
  isConvertedFromNote!: boolean;

  /**
   * Identifier of the original FastAPI note.
   *
   * This value is only populated when
   * isConvertedFromNote = true.
   */
  @ApiProperty({
    description: 'Identifier of the original FastAPI note.',
    example: '550e8400-e29b-41d4-a716-446655440123',
    required: false,
    nullable: true,
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Original note identifier from the FastAPI Notes module.',
  })
  sourceNoteId?: string | null;

  /**
   * Associated category identifier.
   *
   * Nullable because tasks may exist without a category.
   */
  @ApiProperty({
    description: 'Associated category identifier.',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
    nullable: true,
    format: 'uuid',
  })
  @Index('IDX_TASK_CATEGORY_ID')
  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'Foreign key referencing the task category.',
  })
  categoryId?: string | null;

  /**
   * Category relationship.
   *
   * Configuration
   * -------------
   * - Optional relationship
   * - No eager loading
   * - No cascading
   * - Category deletion sets the foreign key to NULL
   *
   * Repository methods should explicitly join this relation
   * only when required.
   */
  @ApiProperty({
    description: 'Category associated with the task.',
    required: false,
    nullable: true,
    type: () => Category,
  })
  @ManyToOne(() => Category, (category) => category.tasks, {
    nullable: true,
    eager: false,
    cascade: false,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'categoryId',
  })
  category?: Category | null;

  /**
   * Tags associated with this task.
   *
   * Configuration
   * -------------
   * - Many-to-many relationship
   * - Lazy loading disabled
   * - No cascading
   * - Explicit loading from repositories
   */
  @ApiProperty({
    description: 'Tags associated with the task.',
    required: false,
    type: () => [Tag],
  })
  @ManyToMany(() => Tag, (tag) => tag.tasks, {
    eager: false,
    cascade: false,
  })
  @JoinTable({
    name: 'task_tags',
    joinColumn: {
      name: 'task_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags?: Tag[];

  /**
   * Timestamp when the task was created.
   *
   * Automatically managed by TypeORM.
   */
  @ApiProperty({
    description: 'Task creation timestamp.',
    example: '2026-06-13T08:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @CreateDateColumn({
    type: 'timestamptz',
    comment: 'Timestamp when the task was created.',
  })
  createdAt!: Date;

  /**
   * Timestamp when the task was last updated.
   *
   * Automatically managed by TypeORM.
   */
  @ApiProperty({
    description: 'Task last update timestamp.',
    example: '2026-06-13T10:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  @UpdateDateColumn({
    type: 'timestamptz',
    comment: 'Timestamp when the task was last updated.',
  })
  updatedAt!: Date;

  /**
   * Soft deletion timestamp.
   *
   * Rather than permanently removing tasks from the database,
   * TypeORM marks them as deleted by setting this column.
   *
   * Benefits
   * --------
   * - Restore deleted tasks
   * - Preserve audit history
   * - Improve analytics
   * - Prevent accidental data loss
   */
  @ApiProperty({
    description: 'Soft deletion timestamp.',
    required: false,
    nullable: true,
    type: String,
    format: 'date-time',
  })
  @Index('IDX_TASK_DELETED_AT')
  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
    comment: 'Timestamp when the task was soft deleted.',
  })
  deletedAt?: Date | null;
}
