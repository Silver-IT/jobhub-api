import {MigrationInterface, QueryRunner} from "typeorm";

export class SimplifyCustomerPageVisitEntity1593535173948 implements MigrationInterface {
    name = 'SimplifyCustomerPageVisitEntity1593535173948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_visit_history" DROP CONSTRAINT "FK_796a73e0119fa583f4fb6fb75c3"`, undefined);
        await queryRunner.query(`ALTER TABLE "email_log" DROP CONSTRAINT "FK_c00c5b4da12afb9687c5f88fb31"`, undefined);
        await queryRunner.query(`CREATE TABLE "email_change_link" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from" character varying NOT NULL, "to" character varying NOT NULL, CONSTRAINT "PK_43e836ef40e6c7e09321eb7876d" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_visit_history" DROP COLUMN "visitDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_visit_history" DROP COLUMN "customerId"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "attachments" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "readAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "hardSkills" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "softSkills" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "cv" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "email" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "firstName" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "lastName" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "page_visit_history" ALTER COLUMN "sub" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "email_log" ADD CONSTRAINT "FK_f65b04ab16eabb381286e0c050e" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_log" DROP CONSTRAINT "FK_f65b04ab16eabb381286e0c050e"`, undefined);
        await queryRunner.query(`ALTER TABLE "page_visit_history" ALTER COLUMN "sub" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "lastName" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "firstName" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "email" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "cv" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "softSkills" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "hardSkills" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "attachments" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_visit_history" ADD "customerId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_visit_history" ADD "visitDate" TIMESTAMP NOT NULL`, undefined);
        await queryRunner.query(`DROP TABLE "email_change_link"`, undefined);
        await queryRunner.query(`ALTER TABLE "email_log" ADD CONSTRAINT "FK_c00c5b4da12afb9687c5f88fb31" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_visit_history" ADD CONSTRAINT "FK_796a73e0119fa583f4fb6fb75c3" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
