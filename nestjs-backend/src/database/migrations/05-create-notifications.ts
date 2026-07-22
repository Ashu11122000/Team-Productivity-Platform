import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateNotifications1753170005000 implements MigrationInterface {
  name = 'CreateNotifications1753170005000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // =========================================================================
    // ENUMS
    // =========================================================================

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

    // =========================================================================
    // TABLE
    // =========================================================================

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

            isNullable: false,
          },

          {
            name: 'message',

            type: 'text',

            isNullable: false,
          },

          {
            name: 'type',

            type: 'enum',

            enumName: 'notification_type_enum',

            isNullable: false,
          },

          {
            name: 'status',

            type: 'enum',

            enumName: 'notification_status_enum',

            default: `'UNREAD'`,
          },

          /**
           * User reference from FastAPI.
           *
           * No FK intentionally.
           */
          {
            name: 'userId',

            type: 'varchar',

            length: '100',

            isNullable: false,
          },

          /**
           * Related domain object.
           */
          {
            name: 'relatedEntityType',

            type: 'varchar',

            length: '100',

            isNullable: true,
          },

          {
            name: 'relatedEntityId',

            type: 'varchar',

            length: '100',

            isNullable: true,
          },

          {
            name: 'readAt',

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
    // INDEXES
    // =========================================================================

    await queryRunner.createIndices(
      'notifications',

      [
        new TableIndex({
          name: 'IDX_NOTIFICATION_USER_ID',

          columnNames: ['userId'],
        }),

        new TableIndex({
          name: 'IDX_NOTIFICATION_USER_STATUS',

          columnNames: ['userId', 'status'],
        }),

        new TableIndex({
          name: 'IDX_NOTIFICATION_USER_CREATED_AT',

          columnNames: ['userId', 'createdAt'],
        }),

        new TableIndex({
          name: 'IDX_NOTIFICATION_TYPE',

          columnNames: ['type'],
        }),

        new TableIndex({
          name: 'IDX_NOTIFICATION_RELATED_ENTITY',

          columnNames: ['relatedEntityType', 'relatedEntityId'],
        }),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'notifications',
      'IDX_NOTIFICATION_RELATED_ENTITY',
    );

    await queryRunner.dropIndex('notifications', 'IDX_NOTIFICATION_TYPE');

    await queryRunner.dropIndex(
      'notifications',
      'IDX_NOTIFICATION_USER_CREATED_AT',
    );

    await queryRunner.dropIndex(
      'notifications',
      'IDX_NOTIFICATION_USER_STATUS',
    );

    await queryRunner.dropIndex('notifications', 'IDX_NOTIFICATION_USER_ID');

    await queryRunner.dropTable('notifications');

    await queryRunner.query(`
      DROP TYPE IF EXISTS
      "notification_status_enum"
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS
      "notification_type_enum"
    `);
  }
}
