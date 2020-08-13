import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtToFinalProposal1592489883001 implements MigrationInterface {
    name = 'AddDeletedAtToFinalProposal1592489883001';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_10b08c17f53e1a2a7d8403e48b6"`, undefined);
        await queryRunner.query(`ALTER TABLE "final_proposal" ADD "deletedAt" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "final_proposal" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "final_proposal" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."site_visit_schedule_type_enum" RENAME TO "schedule_type_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "schedule_type_enum" AS ENUM('SITE_VISIT_SCHEDULE', 'PROJECT_START', 'PICK_OUT_PAVER')`, undefined);
        await queryRunner.query(`ALTER TABLE "schedule" ALTER COLUMN "type" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "schedule" ALTER COLUMN "type" TYPE "schedule_type_enum" USING "type"::"text"::"schedule_type_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "schedule" ALTER COLUMN "type" SET DEFAULT 'SITE_VISIT_SCHEDULE'`, undefined);
        await queryRunner.query(`DROP TYPE "schedule_type_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "schedule" ALTER COLUMN "type" SET NOT NULL`, undefined);
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
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_39651b291fc6c75b4f6993c54c8" FOREIGN KEY ("estimateId") REFERENCES "estimate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_39651b291fc6c75b4f6993c54c8"`, undefined);
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
        await queryRunner.query(`ALTER TABLE "schedule" ALTER COLUMN "type" DROP NOT NULL`, undefined);
        await queryRunner.query(`CREATE TYPE "schedule_type_enum_old" AS ENUM()`, undefined);
        await queryRunner.query(`ALTER TABLE "schedule" ALTER COLUMN "type" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "schedule" ALTER COLUMN "type" TYPE "schedule_type_enum_old" USING "type"::"text"::"schedule_type_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "schedule" ALTER COLUMN "type" SET DEFAULT 'SITE_VISIT_SCHEDULE'`, undefined);
        await queryRunner.query(`DROP TYPE "schedule_type_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "schedule_type_enum_old" RENAME TO  "site_visit_schedule_type_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "final_proposal" DROP COLUMN "updatedAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "final_proposal" DROP COLUMN "createdAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "final_proposal" DROP COLUMN "deletedAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_10b08c17f53e1a2a7d8403e48b6" FOREIGN KEY ("estimateId") REFERENCES "estimate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
