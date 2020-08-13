import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoveAddOnToMilestone1594220706370 implements MigrationInterface {
    name = 'MoveAddOnToMilestone1594220706370';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_add_on" DROP CONSTRAINT "FK_cce8bed0f7eb60daae3c2031067"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment_add_on" RENAME COLUMN "projectId" TO "milestoneId"`, undefined);
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
        await queryRunner.query(`ALTER TABLE "payment_add_on" ADD CONSTRAINT "FK_b24625ef0cce83ba0421fffe9cf" FOREIGN KEY ("milestoneId") REFERENCES "milestone"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_add_on" DROP CONSTRAINT "FK_b24625ef0cce83ba0421fffe9cf"`, undefined);
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
        await queryRunner.query(`ALTER TABLE "payment_add_on" RENAME COLUMN "milestoneId" TO "projectId"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment_add_on" ADD CONSTRAINT "FK_cce8bed0f7eb60daae3c2031067" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
