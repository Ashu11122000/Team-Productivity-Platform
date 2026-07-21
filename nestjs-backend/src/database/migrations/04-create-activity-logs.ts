import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateActivityLogs1718300000004 implements MigrationInterface {
  name = 'CreateActivityLogs1718300000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // =========================================================================
    // ENUMS
    // =========================================================================

    await queryRunner.query(`
      CREATE TYPE "activity_logs_action_enum"
      AS ENUM (
        'TASK_CREATED',
        'TASK_UPDATED',
        'TASK_DELETED',

        'CATEGORY_CREATED',
        'CATEGORY_UPDATED',
        'CATEGORY_DELETED',

        'TAG_CREATED',
        'TAG_UPDATED',
        'TAG_DELETED'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "activity_logs_entity_type_enum"
      AS ENUM (
        'TASK',
        'CATEGORY',
        'TAG'
      )
    `);

    // =========================================================================
    // TABLE
    // =========================================================================

    await queryRunner.createTable(
      new Table({
        name: 'activity_logs',

        columns: [
          {
            name: 'id',

            type: 'uuid',

            isPrimary: true,

            generationStrategy: 'uuid',

            default: 'uuid_generate_v4()',
          },

          {
            name: 'action',

            type: 'enum',

            enumName: 'activity_logs_action_enum',

            isNullable: false,
          },

          {
            name: 'entityType',

            type: 'enum',

            enumName: 'activity_logs_entity_type_enum',

            isNullable: false,
          },

          {
            name: 'entityId',

            type: 'uuid',

            isNullable: false,
          },

          {
            name: 'metadata',

            type: 'jsonb',

            isNullable: true,
          },

          /**
           * User reference from FastAPI.
           *
           * No foreign key intentionally.
           */
          {
            name: 'userId',

            type: 'varchar',

            length: '100',

            isNullable: false,
          },

          {
            name: 'createdAt',

            type: 'timestamp',

            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),

      true,
    );

    // =========================================================================
    // INDEXES
    // =========================================================================

    await queryRunner.createIndices(
      'activity_logs',

      [
        /**
         * User activity lookup
         */
        new TableIndex({
          name: 'IDX_ACTIVITY_USER_ID',

          columnNames: ['userId'],
        }),

        /**
         * Dashboard activity feed optimization
         *
         * WHERE userId = ?
         * ORDER BY createdAt DESC
         */
        new TableIndex({
          name: 'IDX_ACTIVITY_USER_CREATED_AT',

          columnNames: ['userId', 'createdAt'],
        }),

        /**
         * Filter by action
         */
        new TableIndex({
          name: 'IDX_ACTIVITY_ACTION',

          columnNames: ['action'],
        }),

        /**
         * Filter by entity type
         */
        new TableIndex({
          name: 'IDX_ACTIVITY_ENTITY_TYPE',

          columnNames: ['entityType'],
        }),

        /**
         * Entity history lookup
         */
        new TableIndex({
          name: 'IDX_ACTIVITY_ENTITY_ID',

          columnNames: ['entityId'],
        }),

        /**
         * Time based analytics
         */
        new TableIndex({
          name: 'IDX_ACTIVITY_CREATED_AT',

          columnNames: ['createdAt'],
        }),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // =========================================================================
    // DROP INDEXES
    // =========================================================================

    await queryRunner.dropIndex('activity_logs', 'IDX_ACTIVITY_CREATED_AT');

    await queryRunner.dropIndex('activity_logs', 'IDX_ACTIVITY_ENTITY_ID');

    await queryRunner.dropIndex('activity_logs', 'IDX_ACTIVITY_ENTITY_TYPE');

    await queryRunner.dropIndex('activity_logs', 'IDX_ACTIVITY_ACTION');

    await queryRunner.dropIndex(
      'activity_logs',
      'IDX_ACTIVITY_USER_CREATED_AT',
    );

    await queryRunner.dropIndex('activity_logs', 'IDX_ACTIVITY_USER_ID');

    // =========================================================================
    // DROP TABLE
    // =========================================================================

    await queryRunner.dropTable('activity_logs');

    // =========================================================================
    // DROP ENUMS
    // =========================================================================

    await queryRunner.query(`
      DROP TYPE IF EXISTS
      "activity_logs_entity_type_enum"
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS
      "activity_logs_action_enum"
    `);
  }
}
