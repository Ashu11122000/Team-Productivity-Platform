/**
 * ============================================================================
 * File: category.entity.ts
 * ============================================================================
 *
 * Category Entity.
 *
 * Responsibilities
 * ----------------
 * - Represents a user-owned task category.
 * - Defines database schema and relationships.
 * - Maps the Category domain model to PostgreSQL.
 *
 * Notes
 * -----
 * Categories are owned by individual users.
 * The same category name may exist for different users,
 * but each user cannot have duplicate category names.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 * - Node.js 22+
 * ============================================================================
 */

import { ApiProperty } from '@nestjs/swagger';

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { TaskEntity } from '../../tasks/entities/task.entity';

/**
 * ============================================================================
 * Category Entity
 * ============================================================================
 */
@Entity({
  name: 'categories',
})
@Unique('UQ_CATEGORY_USER_NAME', ['userId', 'name'])
@Index('IDX_CATEGORY_USER_ID', ['userId'])
export class Category {
  /**
   * --------------------------------------------------------------------------
   * Primary Key
   * --------------------------------------------------------------------------
   */
  @ApiProperty({
    description: 'Unique category identifier.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * --------------------------------------------------------------------------
   * Category Name
   * --------------------------------------------------------------------------
   */
  @ApiProperty({
    description: 'Category name.',
    example: 'Work',
  })
  @Column({
    type: 'varchar',
    length: 100,
  })
  name!: string;

  /**
   * --------------------------------------------------------------------------
   * Description
   * --------------------------------------------------------------------------
   */
  @ApiProperty({
    description: 'Optional category description.',
    example: 'Tasks related to work projects.',
    nullable: true,
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string | null;

  /**
   * --------------------------------------------------------------------------
   * Display Color
   * --------------------------------------------------------------------------
   */
  @ApiProperty({
    description: 'Optional hexadecimal display color.',
    example: '#3B82F6',
    nullable: true,
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  color?: string | null;

  /**
   * --------------------------------------------------------------------------
   * Owner
   * --------------------------------------------------------------------------
   *
   * User identifier received from the FastAPI
   * authentication service.
   */
  @ApiProperty({
    description: 'Owner user identifier.',
    example: 'c76b12ab-7d98-45b2-aaf2-18c32a3151d4',
  })
  @Column({
    type: 'varchar',
    length: 100,
  })
  userId!: string;

  /**
   * --------------------------------------------------------------------------
   * Tasks
   * --------------------------------------------------------------------------
   *
   * One category can contain multiple tasks.
   */
  @OneToMany(() => TaskEntity, (task) => task.category, {
    cascade: false,
    eager: false,
  })
  tasks!: TaskEntity[];

  /**
   * --------------------------------------------------------------------------
   * Created At
   * --------------------------------------------------------------------------
   */
  @ApiProperty({
    description: 'Creation timestamp.',
    example: '2026-07-21T10:15:30.000Z',
  })
  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt!: Date;

  /**
   * --------------------------------------------------------------------------
   * Updated At
   * --------------------------------------------------------------------------
   */
  @ApiProperty({
    description: 'Last update timestamp.',
    example: '2026-07-21T12:45:30.000Z',
  })
  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt!: Date;
}
