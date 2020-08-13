import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailStatus1592967280678 implements MigrationInterface {
    name = 'AddEmailStatus1592967280678';

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`CREATE TYPE "email_log_type_enum" AS ENUM('CONFIRM_REGISTER', 'MESSAGE_RECEIVED', 'RESET_PASSWORD', 'INVITATION', 'PROJECT_CREATED', 'ESTIMATE_READY', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_REMINDER_FOR_CUSTOMER', 'SITE_VISIT_SCHEDULE_CHANGED', 'RECEIVED_FINAL_PROPOSAL', 'FINAL_PROPOSAL_UPDATED', 'FINAL_PROPOSAL_ACCEPTED', 'MILESTONE_PAYMENT_REQUESTED', 'RECEIVED_MILESTONE_PAYMENT', 'PICK_PAVERS_SCHEDULED', 'PICK_PAVERS_SCHEDULE_CHANGED', 'FINAL_MILESTONE_PAYMENT_REQUESTED', 'FINAL_MILESTONE_MODIFIED', 'TESTIMONIAL_REQUEST', 'NEW_PROJECT_REGISTERED', 'ESTIMATE_REMINDER', 'ESTIMATE_ACCEPTED', 'SITE_VISIT_REMINDER_FOR_CONTRACTOR', 'SUBMIT_PROPOSAL_REMINDER', 'DEPOSIT_MADE', 'MILESTONE_PAID', 'CONTRACT_READY', 'CONTRACT_SIGNED', 'SITE_VISIT_SCHEDULE_CHANGE_REQUEST', 'PICK_PAVERS_SCHEDULE_CHANGE_REQUEST', 'ESTIMATE_DECLINED', 'FINAL_PROPOSAL_DECLINED')`, undefined);
      await queryRunner.query(`CREATE TABLE "email_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" "email_log_type_enum" NOT NULL, "xMessageId" character varying NOT NULL, "email" character varying NOT NULL, "projectId" uuid, "subject" character varying NOT NULL, CONSTRAINT "PK_dcc5bc9a22211af5c30732ecf02" PRIMARY KEY ("id"))`, undefined);
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
        await queryRunner.query(`ALTER TABLE "email_log" ADD CONSTRAINT "FK_c00c5b4da12afb9687c5f88fb31" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_log" DROP CONSTRAINT "FK_c00c5b4da12afb9687c5f88fb31"`, undefined);
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
        await queryRunner.query(`DROP TABLE "email_log"`, undefined);
        await queryRunner.query(`DROP TYPE "email_log_type_enum"`, undefined);
    }

}
