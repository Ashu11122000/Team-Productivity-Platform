import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateReminders1753170006000 implements MigrationInterface {
  public readonly name = 'CreateReminders1753170006000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // -------------------------------------------------------------------------
    // PostgreSQL Extension
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    `);

    // -------------------------------------------------------------------------
    // Enums
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      CREATE TYPE "reminder_type_enum"
      AS ENUM (
        'GENERAL',
        'TASK',
        'NOTE',
        'EVENT',
        'SYSTEM'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "reminder_status_enum"
      AS ENUM (
        'PENDING',
        'TRIGGERED',
        'COMPLETED',
        'CANCELLED'
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

    // -------------------------------------------------------------------------
    // Table
    // -------------------------------------------------------------------------

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
            name: 'userId',
            type: 'uuid',
          },

          {
            name: 'title',
            type: 'varchar',
            length: '150',
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
            default: `'GENERAL'`,
          },

          {
            name: 'status',
            type: 'enum',
            enumName: 'reminder_status_enum',
            default: `'PENDING'`,
          },

          {
            name: 'repeat',
            type: 'enum',
            enumName: 'reminder_repeat_enum',
            default: `'NONE'`,
          },

          {
            name: 'remindAt',
            type: 'timestamptz',
          },

          {
            name: 'triggeredAt',
            type: 'timestamptz',
            isNullable: true,
          },

          {
            name: 'completedAt',
            type: 'timestamptz',
            isNullable: true,
          },

          {
            name: 'reminderOffsetMinutes',
            type: 'integer',
            default: 0,
          },

          {
            name: 'sendNotification',
            type: 'boolean',
            default: true,
          },

          {
            name: 'sendEmail',
            type: 'boolean',
            default: false,
          },

          {
            name: 'taskId',
            type: 'uuid',
            isNullable: true,
          },

          {
            name: 'notificationId',
            type: 'uuid',
            isNullable: true,
          },

          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },

          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },

          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },

          {
            name: 'deletedAt',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
    );

    // -------------------------------------------------------------------------
    // Foreign Key
    // -------------------------------------------------------------------------

    await queryRunner.createForeignKey(
      'reminders',
      new TableForeignKey({
        name: 'FK_REMINDER_TASK',

        columnNames: ['taskId'],

        referencedTableName: 'tasks',

        referencedColumnNames: ['id'],

        onDelete: 'SET NULL',

        onUpdate: 'CASCADE',
      }),
    );

    // -------------------------------------------------------------------------
    // Indexes
    // -------------------------------------------------------------------------

    await queryRunner.createIndices('reminders', [
      new TableIndex({
        name: 'IDX_REMINDER_USER',
        columnNames: ['userId'],
      }),

      new TableIndex({
        name: 'IDX_REMINDER_STATUS',
        columnNames: ['status'],
      }),

      new TableIndex({
        name: 'IDX_REMINDER_TYPE',
        columnNames: ['type'],
      }),

      new TableIndex({
        name: 'IDX_REMINDER_REPEAT',
        columnNames: ['repeat'],
      }),

      new TableIndex({
        name: 'IDX_REMINDER_REMIND_AT',
        columnNames: ['remindAt'],
      }),

      new TableIndex({
        name: 'IDX_REMINDER_TASK',
        columnNames: ['taskId'],
      }),

      new TableIndex({
        name: 'IDX_REMINDER_NOTIFICATION',
        columnNames: ['notificationId'],
      }),

      new TableIndex({
        name: 'IDX_REMINDER_USER_REMIND_AT',
        columnNames: ['userId', 'remindAt'],
      }),

      new TableIndex({
        name: 'IDX_REMINDER_USER_STATUS',
        columnNames: ['userId', 'status'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('reminders', 'IDX_REMINDER_USER_STATUS');
    await queryRunner.dropIndex('reminders', 'IDX_REMINDER_USER_REMIND_AT');
    await queryRunner.dropIndex('reminders', 'IDX_REMINDER_NOTIFICATION');
    await queryRunner.dropIndex('reminders', 'IDX_REMINDER_TASK');
    await queryRunner.dropIndex('reminders', 'IDX_REMINDER_REMIND_AT');
    await queryRunner.dropIndex('reminders', 'IDX_REMINDER_REPEAT');
    await queryRunner.dropIndex('reminders', 'IDX_REMINDER_TYPE');
    await queryRunner.dropIndex('reminders', 'IDX_REMINDER_STATUS');
    await queryRunner.dropIndex('reminders', 'IDX_REMINDER_USER');

    await queryRunner.dropForeignKey('reminders', 'FK_REMINDER_TASK');

    await queryRunner.dropTable('reminders');

    await queryRunner.query(`DROP TYPE IF EXISTS "reminder_repeat_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "reminder_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "reminder_type_enum"`);
  }
}
