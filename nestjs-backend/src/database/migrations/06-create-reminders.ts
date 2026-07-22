/*
 * ============================================================================
 * File: 06-Create-reminders.ts
 * ============================================================================
 *
 * Reminders Database Migration
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Create reminders table.
 * - Create reminder enums.
 * - Add indexes for dashboard queries.
 *
 * Ownership
 * ----------------------------------------------------------------------------
 * Users are owned by FastAPI.
 *
 * Therefore:
 *
 * userId
 * -------
 * Stored as reference only.
 *
 * No foreign key is created.
 *
 * Compatible:
 * ----------------------------------------------------------------------------
 * - PostgreSQL
 * - TypeORM 0.3+
 *
 * ============================================================================
 */

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateReminders1753170006000 implements MigrationInterface {
  name = 'CreateReminders1753170006000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // =========================================================================
    // ENUMS
    // =========================================================================

    await queryRunner.query(`
      CREATE TYPE "reminder_type_enum"
      AS ENUM (

        'TASK',

        'NOTE',

        'SYSTEM'

      )
    `);

    await queryRunner.query(`
      CREATE TYPE "reminder_repeat_enum"
      AS ENUM (

        'NONE',

        'DAILY',

        'WEEKLY',

        'MONTHLY',

        'YEARLY'

      )
    `);

    await queryRunner.query(`
      CREATE TYPE "reminder_status_enum"
      AS ENUM (

        'ACTIVE',

        'COMPLETED',

        'CANCELLED'

      )
    `);

    // =========================================================================
    // TABLE
    // =========================================================================

    await queryRunner.createTable(
      new Table({
        name: 'reminders',

        columns: [
          {
            name: 'id',

            type: 'uuid',

            isPrimary: true,

            generationStrategy: 'uuid',

            default: 'uuid_generate_v4()',
          },

          {
            name: 'title',

            type: 'varchar',

            length: '255',

            isNullable: false,
          },

          {
            name: 'description',

            type: 'text',

            isNullable: true,
          },

          {
            name: 'type',

            type: 'enum',

            enumName: 'reminder_type_enum',

            isNullable: false,
          },

          {
            name: 'repeat',

            type: 'enum',

            enumName: 'reminder_repeat_enum',

            default: `'NONE'`,
          },

          {
            name: 'status',

            type: 'enum',

            enumName: 'reminder_status_enum',

            default: `'ACTIVE'`,
          },

          /**
           * User reference from FastAPI.
           */
          {
            name: 'userId',

            type: 'varchar',

            length: '100',

            isNullable: false,
          },

          /**
           * Optional relation with Task.
           *
           * Tasks are owned by NestJS.
           */
          {
            name: 'taskId',

            type: 'uuid',

            isNullable: true,
          },

          {
            name: 'remindAt',

            type: 'timestamp',

            isNullable: false,
          },

          {
            name: 'completedAt',

            type: 'timestamp',

            isNullable: true,
          },

          {
            name: 'createdAt',

            type: 'timestamp',

            default: 'CURRENT_TIMESTAMP',
          },

          {
            name: 'updatedAt',

            type: 'timestamp',

            default: 'CURRENT_TIMESTAMP',
          },

          {
            name: 'deletedAt',

            type: 'timestamp',

            isNullable: true,
          },
        ],
      }),
    );

    // =========================================================================
    // TASK RELATION
    // =========================================================================

    await queryRunner.createForeignKey(
      'reminders',

      new TableForeignKey({
        name: 'FK_REMINDER_TASK',

        columnNames: ['taskId'],

        referencedTableName: 'tasks',

        referencedColumnNames: ['id'],

        onDelete: 'SET NULL',
      }),
    );

    // =========================================================================
    // INDEXES
    // =========================================================================

    await queryRunner.createIndices(
      'reminders',

      [
        /**
         * User reminders lookup
         */
        new TableIndex({
          name: 'IDX_REMINDER_USER_ID',

          columnNames: ['userId'],
        }),

        /**
         * Dashboard upcoming reminders
         */
        new TableIndex({
          name: 'IDX_REMINDER_USER_REMIND_AT',

          columnNames: ['userId', 'remindAt'],
        }),

        /**
         * Active reminder scheduler query
         */
        new TableIndex({
          name: 'IDX_REMINDER_STATUS',

          columnNames: ['status'],
        }),

        /**
         * Task reminder lookup
         */
        new TableIndex({
          name: 'IDX_REMINDER_TASK_ID',

          columnNames: ['taskId'],
        }),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // =========================================================================
    // DROP INDEXES
    // =========================================================================

    await queryRunner.dropIndex('reminders', 'IDX_REMINDER_TASK_ID');

    await queryRunner.dropIndex('reminders', 'IDX_REMINDER_STATUS');

    await queryRunner.dropIndex('reminders', 'IDX_REMINDER_USER_REMIND_AT');

    await queryRunner.dropIndex('reminders', 'IDX_REMINDER_USER_ID');

    // =========================================================================
    // DROP FOREIGN KEY
    // =========================================================================

    await queryRunner.dropForeignKey('reminders', 'FK_REMINDER_TASK');

    // =========================================================================
    // DROP TABLE
    // =========================================================================

    await queryRunner.dropTable('reminders');

    // =========================================================================
    // DROP ENUMS
    // =========================================================================

    await queryRunner.query(`
      DROP TYPE IF EXISTS
      "reminder_status_enum"
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS
      "reminder_repeat_enum"
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS
      "reminder_type_enum"
    `);
  }
}
