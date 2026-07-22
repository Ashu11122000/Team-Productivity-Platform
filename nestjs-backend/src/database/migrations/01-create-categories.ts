import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategories1753170001000 implements MigrationInterface {
  public readonly name = 'CreateCategories1753170001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // -------------------------------------------------------------------------
    // PostgreSQL Extension
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    `);

    // -------------------------------------------------------------------------
    // Categories Table
    // -------------------------------------------------------------------------

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
         * Authentication is managed by FastAPI.
         * No foreign key intentionally.
         */
        "userId"
          character varying(100)
          NOT NULL,

        "createdAt"
          TIMESTAMPTZ
          NOT NULL
          DEFAULT now(),

        "updatedAt"
          TIMESTAMPTZ
          NOT NULL
          DEFAULT now(),

        CONSTRAINT
          "PK_categories_id"
          PRIMARY KEY ("id"),

        CONSTRAINT
          "UQ_CATEGORY_USER_NAME"
          UNIQUE ("userId", "name")

      )
    `);

    // -------------------------------------------------------------------------
    // Indexes
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      CREATE INDEX
      "IDX_CATEGORY_USER_ID"
      ON "categories"
      ("userId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // -------------------------------------------------------------------------
    // Indexes
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      DROP INDEX "public"."IDX_CATEGORY_USER_ID"
    `);

    // -------------------------------------------------------------------------
    // Table
    // -------------------------------------------------------------------------

    await queryRunner.query(`
      DROP TABLE "categories"
    `);
  }
}
