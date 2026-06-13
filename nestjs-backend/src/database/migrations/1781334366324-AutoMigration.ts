import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1781334366324 implements MigrationInterface {
    name = 'AutoMigration1781334366324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'TODO', "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'MEDIUM', "dueDate" TIMESTAMP, "userId" character varying(100) NOT NULL, "isConvertedFromNote" boolean NOT NULL DEFAULT false, "sourceNoteId" character varying(100), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_TASK_USER_ID" ON "tasks" ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_TASK_USER_ID"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
    }

}
