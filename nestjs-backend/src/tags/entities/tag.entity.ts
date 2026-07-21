/**
 * ============================================================================
 * File: tag.entity.ts
 * ============================================================================
 *
 * Enterprise Tag Entity.
 *
 * Responsibilities
 * ----------------
 * - Represents a user-defined task tag.
 * - Defines the database schema for tags.
 * - Maintains relationships with tasks.
 * - Supports soft deletion.
 * - Stores audit timestamps.
 *
 * Notes
 * -----
 * - Authentication is owned by FastAPI.
 * - userId references the authenticated FastAPI user.
 * - Tag names must be unique per user.
 * - A tag can be assigned to multiple tasks.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 * ============================================================================
 */

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { TaskEntity } from '../../tasks/entities/task.entity';

/**
 * ============================================================================
 * Tag Entity
 * ============================================================================
 */

@Entity('tags')
@Index('IDX_TAG_USER_NAME', ['userId', 'name'], {
  unique: true,
})
export class TagEntity {
  /**
   * Unique tag identifier.
   */
  @ApiProperty({
    description: 'Unique tag identifier.',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Tag name.
   */
  @ApiProperty({
    description: 'Tag name.',
    example: 'Backend',
  })
  @Column({
    type: 'varchar',
    length: 100,
  })
  name!: string;

  /**
   * Optional hexadecimal color.
   */
  @ApiProperty({
    description: 'Hexadecimal tag color.',
    example: '#3B82F6',
    nullable: true,
  })
  @Column({
    type: 'varchar',
    length: 9,
    nullable: true,
  })
  color!: string | null;

  /**
   * Authenticated FastAPI user identifier.
   */
  @ApiProperty({
    description: 'Owner of the tag.',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @Index('IDX_TAG_USER_ID')
  @Column({
    type: 'varchar',
    length: 100,
  })
  userId!: string;

  /**
   * Tasks associated with this tag.
   *
   * The Task entity owns the relationship.
   */
  @ManyToMany(() => TaskEntity, (task) => task.tags)
  tasks!: TaskEntity[];

  /**
   * Creation timestamp.
   */
  @ApiProperty({
    description: 'Timestamp when the tag was created.',
    example: '2026-07-21T10:30:00.000Z',
  })
  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt!: Date;

  /**
   * Last update timestamp.
   */
  @ApiProperty({
    description: 'Timestamp when the tag was last updated.',
    example: '2026-07-21T11:15:00.000Z',
  })
  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt!: Date;

  /**
   * Soft deletion timestamp.
   *
   * A non-null value indicates that the tag has been
   * soft deleted and can be restored.
   */
  @ApiProperty({
    description: 'Soft deletion timestamp.',
    nullable: true,
    example: null,
  })
  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt!: Date | null;
}
