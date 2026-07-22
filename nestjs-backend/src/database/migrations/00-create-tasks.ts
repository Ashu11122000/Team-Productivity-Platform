import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTasksAddColumns1753170007000 implements MigrationInterface {
  public readonly name = 'UpdateTasksAddColumns1753170007000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // -------------------------------------------------------------------------
    // New Columns
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD COLUMN "completedAt" TIMESTAMPTZ
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD COLUMN "reminderAt" TIMESTAMPTZ
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD COLUMN "estimatedMinutes" INTEGER
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD COLUMN "userId" VARCHAR(100) NOT NULL DEFAULT ''
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD COLUMN "isConvertedFromNote" BOOLEAN NOT NULL DEFAULT FALSE
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD COLUMN "sourceNoteId" VARCHAR(100)
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD COLUMN "categoryId" UUID
    `);

    // -------------------------------------------------------------------------
    // Indexes
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      CREATE INDEX "IDX_TASK_COMPLETED_AT"
      ON "tasks" ("completedAt")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_TASK_REMINDER_AT"
      ON "tasks" ("reminderAt")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_TASK_CATEGORY_ID"
      ON "tasks" ("categoryId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_TASK_DELETED_AT"
      ON "tasks" ("deletedAt")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_TASK_TITLE"
      ON "tasks" ("title")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_TASK_STATUS"
      ON "tasks" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_TASK_PRIORITY"
      ON "tasks" ("priority")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_TASK_USER_ID"
      ON "tasks" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_TASK_USER_STATUS"
      ON "tasks" ("userId", "status")
    `);

    // -------------------------------------------------------------------------
    // Foreign Key
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD CONSTRAINT "FK_TASK_CATEGORY"
      FOREIGN KEY ("categoryId")
      REFERENCES "categories"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // -------------------------------------------------------------------------
    // Foreign Key
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      ALTER TABLE "tasks"
      DROP CONSTRAINT "FK_TASK_CATEGORY"
    `);

    // -------------------------------------------------------------------------
    // Indexes
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      DROP INDEX "public"."IDX_TASK_USER_STATUS"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_TASK_USER_ID"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_TASK_PRIORITY"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_TASK_STATUS"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_TASK_TITLE"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_TASK_DELETED_AT"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_TASK_CATEGORY_ID"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_TASK_REMINDER_AT"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_TASK_COMPLETED_AT"
    `);

    // -------------------------------------------------------------------------
    // Columns
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      ALTER TABLE "tasks"
      DROP COLUMN "categoryId"
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"
      DROP COLUMN "sourceNoteId"
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"
      DROP COLUMN "isConvertedFromNote"
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"
      DROP COLUMN "userId"
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"
      DROP COLUMN "estimatedMinutes"
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"
      DROP COLUMN "reminderAt"
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"
      DROP COLUMN "completedAt"
    `);
  }
}
