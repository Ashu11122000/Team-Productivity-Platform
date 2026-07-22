import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTags1753170002000 implements MigrationInterface {
  public readonly name = 'CreateTags1753170002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    `);

    await queryRunner.query(`
      CREATE TABLE "tags" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),

        "name" character varying(100) NOT NULL,

        "color" character varying(9),

        "userId" character varying(100) NOT NULL,

        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

        "deletedAt" TIMESTAMPTZ,

        CONSTRAINT "PK_tags_id"
          PRIMARY KEY ("id"),

        CONSTRAINT "UQ_TAG_USER_NAME"
          UNIQUE ("userId", "name")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_TAG_USER_ID"
      ON "tags" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_TAG_USER_NAME"
      ON "tags" ("userId", "name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "public"."IDX_TAG_USER_NAME"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_TAG_USER_ID"
    `);

    await queryRunner.query(`
      DROP TABLE "tags"
    `);
  }
}
