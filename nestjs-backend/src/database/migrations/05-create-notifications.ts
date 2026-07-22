import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateNotifications1753170005000 implements MigrationInterface {
  public readonly name = 'CreateNotifications1753170005000';

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
      CREATE TYPE "notification_type_enum"
      AS ENUM (
        'TASK_DUE',
        'TASK_OVERDUE',
        'TASK_COMPLETED',
        'CATEGORY_UPDATED',
        'TAG_ASSIGNED',
        'SYSTEM'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "notification_status_enum"
      AS ENUM (
        'UNREAD',
        'READ'
      )
    `);

    // -------------------------------------------------------------------------
    // Table
    // -------------------------------------------------------------------------

    await queryRunner.createTable(
      new Table({
        name: 'notifications',

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
          },

          {
            name: 'message',
            type: 'text',
          },

          {
            name: 'type',
            type: 'enum',
            enumName: 'notification_type_enum',
          },

          {
            name: 'status',
            type: 'enum',
            enumName: 'notification_status_enum',
            default: `'UNREAD'`,
          },

          /**
           * FastAPI authenticated user identifier.
           * No foreign key intentionally.
           */
          {
            name: 'userId',
            type: 'varchar',
            length: '255',
          },

          {
            name: 'entityId',
            type: 'uuid',
            isNullable: true,
          },

          {
            name: 'entityType',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },

          {
            name: 'readAt',
            type: 'timestamptz',
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
    // Indexes
    // -------------------------------------------------------------------------

    await queryRunner.createIndices('notifications', [
      new TableIndex({
        name: 'IDX_NOTIFICATION_USER_ID',
        columnNames: ['userId'],
      }),

      new TableIndex({
        name: 'IDX_NOTIFICATION_STATUS',
        columnNames: ['status'],
      }),

      new TableIndex({
        name: 'IDX_NOTIFICATION_TYPE',
        columnNames: ['type'],
      }),

      new TableIndex({
        name: 'IDX_NOTIFICATION_CREATED_AT',
        columnNames: ['createdAt'],
      }),

      new TableIndex({
        name: 'IDX_NOTIFICATION_USER_STATUS',
        columnNames: ['userId', 'status'],
      }),

      new TableIndex({
        name: 'IDX_NOTIFICATION_USER_TYPE',
        columnNames: ['userId', 'type'],
      }),

      new TableIndex({
        name: 'IDX_NOTIFICATION_USER_STATUS_CREATED',
        columnNames: ['userId', 'status', 'createdAt'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // -------------------------------------------------------------------------
    // Indexes
    // -------------------------------------------------------------------------

    await queryRunner.dropIndex(
      'notifications',
      'IDX_NOTIFICATION_USER_STATUS_CREATED',
    );

    await queryRunner.dropIndex('notifications', 'IDX_NOTIFICATION_USER_TYPE');

    await queryRunner.dropIndex(
      'notifications',
      'IDX_NOTIFICATION_USER_STATUS',
    );

    await queryRunner.dropIndex('notifications', 'IDX_NOTIFICATION_CREATED_AT');

    await queryRunner.dropIndex('notifications', 'IDX_NOTIFICATION_TYPE');

    await queryRunner.dropIndex('notifications', 'IDX_NOTIFICATION_STATUS');

    await queryRunner.dropIndex('notifications', 'IDX_NOTIFICATION_USER_ID');

    // -------------------------------------------------------------------------
    // Table
    // -------------------------------------------------------------------------

    await queryRunner.dropTable('notifications');

    // -------------------------------------------------------------------------
    // Enums
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      DROP TYPE IF EXISTS "notification_status_enum"
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS "notification_type_enum"
    `);
  }
}
