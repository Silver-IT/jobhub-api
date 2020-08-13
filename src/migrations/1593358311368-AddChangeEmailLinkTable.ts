import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChangeEmailLinkTable1593358311368 implements MigrationInterface {
    name = 'AddChangeEmailLinkTable1593358311368';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."email_log_type_enum" RENAME TO "email_log_type_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "email_log_type_enum" AS ENUM('CONFIRM_REGISTER', 'MESSAGE_RECEIVED', 'RESET_PASSWORD', 'INVITATION', 'PROJECT_CREATED', 'ESTIMATE_READY', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_REMINDER_FOR_CUSTOMER', 'SITE_VISIT_SCHEDULE_CHANGED', 'RECEIVED_FINAL_PROPOSAL', 'FINAL_PROPOSAL_UPDATED', 'FINAL_PROPOSAL_ACCEPTED', 'MILESTONE_PAYMENT_REQUESTED', 'RECEIVED_MILESTONE_PAYMENT', 'PICK_PAVERS_SCHEDULED', 'PICK_PAVERS_SCHEDULE_CHANGED', 'FINAL_MILESTONE_PAYMENT_REQUESTED', 'FINAL_MILESTONE_MODIFIED', 'TESTIMONIAL_REQUEST', 'NEW_PROJECT_REGISTERED', 'ESTIMATE_REMINDER', 'ESTIMATE_ACCEPTED', 'SITE_VISIT_REMINDER_FOR_CONTRACTOR', 'SUBMIT_PROPOSAL_REMINDER', 'DEPOSIT_MADE', 'MILESTONE_PAID', 'CONTRACT_READY', 'CONTRACT_SIGNED', 'SITE_VISIT_SCHEDULE_CHANGE_REQUEST', 'PICK_PAVERS_SCHEDULE_CHANGE_REQUEST', 'ESTIMATE_DECLINED', 'FINAL_PROPOSAL_DECLINED', 'CHANGE_EMAIL')`, undefined);
        await queryRunner.query(`ALTER TABLE "email_log" ALTER COLUMN "type" TYPE "email_log_type_enum" USING "type"::"text"::"email_log_type_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "email_log_type_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "attachments" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "readAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "hardSkills" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "softSkills" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "cv" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "email" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "firstName" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "lastName" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "page_visit_history" ALTER COLUMN "sub" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_visit_history" ALTER COLUMN "sub" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "lastName" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "firstName" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "email" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "cv" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "softSkills" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "hardSkills" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "attachments" DROP DEFAULT`, undefined);
        await queryRunner.query(`CREATE TYPE "email_log_type_enum_old" AS ENUM('CONFIRM_REGISTER', 'CONTRACT_READY', 'CONTRACT_SIGNED', 'DEPOSIT_MADE', 'ESTIMATE_ACCEPTED', 'ESTIMATE_DECLINED', 'ESTIMATE_READY', 'ESTIMATE_REMINDER', 'FINAL_MILESTONE_MODIFIED', 'FINAL_MILESTONE_PAYMENT_REQUESTED', 'FINAL_PROPOSAL_ACCEPTED', 'FINAL_PROPOSAL_DECLINED', 'FINAL_PROPOSAL_UPDATED', 'INVITATION', 'MESSAGE_RECEIVED', 'MILESTONE_PAID', 'MILESTONE_PAYMENT_REQUESTED', 'NEW_PROJECT_REGISTERED', 'PICK_PAVERS_SCHEDULED', 'PICK_PAVERS_SCHEDULE_CHANGED', 'PICK_PAVERS_SCHEDULE_CHANGE_REQUEST', 'PROJECT_CREATED', 'RECEIVED_FINAL_PROPOSAL', 'RECEIVED_MILESTONE_PAYMENT', 'RESET_PASSWORD', 'SITE_VISIT_REMINDER_FOR_CONTRACTOR', 'SITE_VISIT_REMINDER_FOR_CUSTOMER', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_SCHEDULE_CHANGED', 'SITE_VISIT_SCHEDULE_CHANGE_REQUEST', 'SUBMIT_PROPOSAL_REMINDER', 'TESTIMONIAL_REQUEST')`, undefined);
        await queryRunner.query(`ALTER TABLE "email_log" ALTER COLUMN "type" TYPE "email_log_type_enum_old" USING "type"::"text"::"email_log_type_enum_old"`, undefined);
        await queryRunner.query(`DROP TYPE "email_log_type_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "email_log_type_enum_old" RENAME TO  "email_log_type_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
    }

}
