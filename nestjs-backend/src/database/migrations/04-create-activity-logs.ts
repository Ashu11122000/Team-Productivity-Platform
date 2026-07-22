import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateActivityLogs1753170004000 implements MigrationInterface {
  public readonly name = 'CreateActivityLogs1753170004000';

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
      CREATE TYPE "activity_action_enum"
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
      CREATE TYPE "activity_entity_type_enum"
      AS ENUM (
        'TASK',
        'CATEGORY',
        'TAG'
      )
    `);

    // -------------------------------------------------------------------------
    // Table
    // -------------------------------------------------------------------------

    await queryRunner.createTable(
      new Table({
        name: 'activity_logs',

        comment: 'Stores immutable user activity logs.',

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
            enumName: 'activity_action_enum',
          },

          {
            name: 'entityType',
            type: 'enum',
            enumName: 'activity_entity_type_enum',
          },

          {
            name: 'entityId',
            type: 'uuid',
          },

          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },

          /**
           * User identifier from FastAPI.
           *
           * No foreign key intentionally.
           */
          {
            name: 'userId',
            type: 'varchar',
            length: '100',
          },

          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // -------------------------------------------------------------------------
    // Indexes
    // -------------------------------------------------------------------------

    await queryRunner.createIndices('activity_logs', [
      new TableIndex({
        name: 'IDX_ACTIVITY_USER_ID',
        columnNames: ['userId'],
      }),

      new TableIndex({
        name: 'IDX_ACTIVITY_ACTION',
        columnNames: ['action'],
      }),

      new TableIndex({
        name: 'IDX_ACTIVITY_ENTITY_TYPE',
        columnNames: ['entityType'],
      }),

      new TableIndex({
        name: 'IDX_ACTIVITY_ENTITY_ID',
        columnNames: ['entityId'],
      }),

      /**
       * Optional enterprise indexes
       * Useful for dashboards and audit history queries.
       */

      new TableIndex({
        name: 'IDX_ACTIVITY_USER_CREATED_AT',
        columnNames: ['userId', 'createdAt'],
      }),

      new TableIndex({
        name: 'IDX_ACTIVITY_CREATED_AT',
        columnNames: ['createdAt'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // -------------------------------------------------------------------------
    // Indexes
    // -------------------------------------------------------------------------

    await queryRunner.dropIndex('activity_logs', 'IDX_ACTIVITY_CREATED_AT');

    await queryRunner.dropIndex(
      'activity_logs',
      'IDX_ACTIVITY_USER_CREATED_AT',
    );

    await queryRunner.dropIndex('activity_logs', 'IDX_ACTIVITY_ENTITY_ID');

    await queryRunner.dropIndex('activity_logs', 'IDX_ACTIVITY_ENTITY_TYPE');

    await queryRunner.dropIndex('activity_logs', 'IDX_ACTIVITY_ACTION');

    await queryRunner.dropIndex('activity_logs', 'IDX_ACTIVITY_USER_ID');

    // -------------------------------------------------------------------------
    // Table
    // -------------------------------------------------------------------------

    await queryRunner.dropTable('activity_logs');

    // -------------------------------------------------------------------------
    // Enums
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      DROP TYPE IF EXISTS "activity_entity_type_enum"
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS "activity_action_enum"
    `);
  }
}
