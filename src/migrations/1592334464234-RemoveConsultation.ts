import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveConsultation1592334464234 implements MigrationInterface {
    name = 'RemoveConsultation1592334464234';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "site_visit_schedule" DROP COLUMN "selected"`, undefined);
        await queryRunner.query(`ALTER TABLE "site_visit_schedule" ADD "deletedAt" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "site_visit_schedule" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "site_visit_schedule" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`CREATE TYPE "site_visit_schedule_type_enum" AS ENUM('SITE_VISIT_SCHEDULE', 'PROJECT_START', 'PICK_OUT_PAVER')`, undefined);
        await queryRunner.query(`ALTER TABLE "site_visit_schedule" ADD "type" "site_visit_schedule_type_enum" default 'SITE_VISIT_SCHEDULE'`, undefined);
        await queryRunner.query(`ALTER TABLE "site_visit_schedule" ADD "done" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "patioPackageId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_ffccedcf590559edb17d64f22df" UNIQUE ("patioPackageId")`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD "pickOutPaverScheduleId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "UQ_1531a21574b22df3d7cf1934491" UNIQUE ("pickOutPaverScheduleId")`, undefined);
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
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_ffccedcf590559edb17d64f22df" FOREIGN KEY ("patioPackageId") REFERENCES "patio_package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_1531a21574b22df3d7cf1934491" FOREIGN KEY ("pickOutPaverScheduleId") REFERENCES "site_visit_schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_1531a21574b22df3d7cf1934491"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ffccedcf590559edb17d64f22df"`, undefined);
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
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "UQ_1531a21574b22df3d7cf1934491"`, undefined);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "pickOutPaverScheduleId"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_ffccedcf590559edb17d64f22df"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "patioPackageId"`, undefined);
        await queryRunner.query(`ALTER TABLE "site_visit_schedule" DROP COLUMN "done"`, undefined);
        await queryRunner.query(`ALTER TABLE "site_visit_schedule" DROP COLUMN "type"`, undefined);
        await queryRunner.query(`DROP TYPE "site_visit_schedule_type_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "site_visit_schedule" DROP COLUMN "updatedAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "site_visit_schedule" DROP COLUMN "createdAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "site_visit_schedule" DROP COLUMN "deletedAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "site_visit_schedule" ADD "selected" boolean NOT NULL DEFAULT false`, undefined);
    }

}
