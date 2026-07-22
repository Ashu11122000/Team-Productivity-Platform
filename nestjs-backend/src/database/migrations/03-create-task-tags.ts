import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskTags1753170003000 implements MigrationInterface {
  public readonly name = 'CreateTaskTags1753170003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "task_tags" (
        "task_id" uuid NOT NULL,
        "tag_id" uuid NOT NULL,

        CONSTRAINT "PK_TASK_TAGS"
          PRIMARY KEY ("task_id", "tag_id")
      )
    `);

    // -------------------------------------------------------------------------
    // Indexes
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      CREATE INDEX "IDX_TASK_TAG_TASK_ID"
      ON "task_tags" ("task_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_TASK_TAG_TAG_ID"
      ON "task_tags" ("tag_id")
    `);

    // -------------------------------------------------------------------------
    // Foreign Keys
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      ALTER TABLE "task_tags"
      ADD CONSTRAINT "FK_TASK_TAG_TASK"
      FOREIGN KEY ("task_id")
      REFERENCES "tasks" ("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "task_tags"
      ADD CONSTRAINT "FK_TASK_TAG_TAG"
      FOREIGN KEY ("tag_id")
      REFERENCES "tags" ("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // -------------------------------------------------------------------------
    // Foreign Keys
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      ALTER TABLE "task_tags"
      DROP CONSTRAINT "FK_TASK_TAG_TAG"
    `);

    await queryRunner.query(`
      ALTER TABLE "task_tags"
      DROP CONSTRAINT "FK_TASK_TAG_TASK"
    `);

    // -------------------------------------------------------------------------
    // Indexes
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      DROP INDEX "public"."IDX_TASK_TAG_TAG_ID"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_TASK_TAG_TASK_ID"
    `);

    // -------------------------------------------------------------------------
    // Table
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      DROP TABLE "task_tags"
    `);
  }
}
