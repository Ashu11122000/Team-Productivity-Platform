import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategories1753170001000 implements MigrationInterface {
  name = 'CreateCategories1753170001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "categories" (

        "id"
          uuid
          NOT NULL
          DEFAULT uuid_generate_v4(),


        "name"
          character varying(100)
          NOT NULL,


        "description"
          text,


        "color"
          character varying(20),


        /**
         * User ownership reference.
         *
         * Users are managed by FastAPI.
         * No FK intentionally.
         */
        "userId"
          character varying(100)
          NOT NULL,


        "createdAt"
          timestamp
          NOT NULL
          DEFAULT now(),


        "updatedAt"
          timestamp
          NOT NULL
          DEFAULT now(),


        "deletedAt"
          timestamp,


        CONSTRAINT
          "PK_categories_id"
          PRIMARY KEY ("id"),


        CONSTRAINT
          "UQ_CATEGORY_USER_NAME"
          UNIQUE(
            "userId",
            "name"
          )

      )
    `);

    /**
     * User category lookup
     */
    await queryRunner.query(`
      CREATE INDEX
      "IDX_CATEGORY_USER_ID"
      ON "categories"
      ("userId")
    `);

    /**
     * Category search optimization
     */
    await queryRunner.query(`
      CREATE INDEX
      "IDX_CATEGORY_USER_NAME"
      ON "categories"
      ("userId","name")
    `);

    /**
     * Add category relationship to tasks.
     */
    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD COLUMN "categoryId" uuid
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"

      ADD CONSTRAINT
      "FK_TASK_CATEGORY"

      FOREIGN KEY ("categoryId")

      REFERENCES "categories"("id")

      ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tasks"
      DROP CONSTRAINT
      "FK_TASK_CATEGORY"
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"
      DROP COLUMN
      "categoryId"
    `);

    await queryRunner.query(`
      DROP INDEX
      "public"."IDX_CATEGORY_USER_NAME"
    `);

    await queryRunner.query(`
      DROP INDEX
      "public"."IDX_CATEGORY_USER_ID"
    `);

    await queryRunner.query(`
      DROP TABLE
      "categories"
    `);
  }
}
