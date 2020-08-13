import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMaterialRequest1595170052023 implements MigrationInterface {
  name = 'AddMaterialRequest1595170052023';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "material_request_type_enum" AS ENUM('STEPS', 'SITTING_WALL', 'PILLARS', 'LIGHTING', 'PATIO', 'RAISED_PATIO', 'WALKWAY', 'RETAINING_WALL', 'POOL_PATIO', 'FIRE_PIT', 'DRIVEWAY_PARKING', 'VENEER', 'FIREPLACE', 'OUTDOOR_KITCHEN', 'CLEANING_SANDING', 'MINOR_REPAIR', 'LANDSCAPING_PLANTS', 'OTHER')`, undefined);
    await queryRunner.query(`CREATE TABLE "material_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" "material_request_type_enum" NOT NULL, "notes" text array NOT NULL, "projectId" uuid, CONSTRAINT "PK_0d050223cb749e754cb52e914df" PRIMARY KEY ("id"))`, undefined);
    await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" SET DEFAULT null`, undefined);
    await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" SET DEFAULT null`, undefined);
    await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" SET DEFAULT null`, undefined);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" SET DEFAULT null`, undefined);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" SET DEFAULT null`, undefined);
    await queryRunner.query(`ALTER TYPE "public"."email_log_type_enum" RENAME TO "email_log_type_enum_old"`, undefined);
    await queryRunner.query(`CREATE TYPE "email_log_type_enum" AS ENUM('CONFIRM_REGISTER', 'MESSAGE_RECEIVED', 'RESET_PASSWORD', 'INVITATION', 'PROJECT_CREATED', 'ESTIMATE_READY', 'ESTIMATE_UPDATED', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_REMINDER_FOR_CUSTOMER', 'SITE_VISIT_SCHEDULE_CHANGED', 'RECEIVED_FINAL_PROPOSAL', 'FINAL_PROPOSAL_UPDATED', 'FINAL_PROPOSAL_ACCEPTED', 'MILESTONE_PAYMENT_REQUESTED', 'RECEIVED_MILESTONE_PAYMENT', 'PICK_PAVERS_SCHEDULED', 'PICK_PAVERS_SCHEDULE_CHANGED', 'FINAL_MILESTONE_PAYMENT_REQUESTED', 'FINAL_MILESTONE_MODIFIED', 'TESTIMONIAL_REQUEST', 'DEPOSIT_MILESTONE_UPDATED', 'NEW_PROJECT_REGISTERED', 'ESTIMATE_REMINDER', 'ESTIMATE_ACCEPTED', 'SITE_VISIT_REMINDER_FOR_CONTRACTOR', 'SUBMIT_PROPOSAL_REMINDER', 'DEPOSIT_MADE', 'MILESTONE_PAID', 'CONTRACT_READY', 'CONTRACT_SIGNED', 'SITE_VISIT_SCHEDULE_CHANGE_REQUEST', 'PICK_PAVERS_SCHEDULE_CHANGE_REQUEST', 'ESTIMATE_DECLINED', 'FINAL_PROPOSAL_DECLINED', 'CHANGE_EMAIL')`, undefined);
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
    await queryRunner.query(`ALTER TABLE "material_request" ADD CONSTRAINT "FK_6c4a6394c7a69d2fa80d46914a5" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "material_request" DROP CONSTRAINT "FK_6c4a6394c7a69d2fa80d46914a5"`, undefined);
    await queryRunner.query(`ALTER TABLE "page_visit_history" ALTER COLUMN "sub" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "lastName" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "firstName" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "email" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "cv" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "softSkills" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "hardSkills" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "attachments" DROP DEFAULT`, undefined);
    await queryRunner.query(`CREATE TYPE "email_log_type_enum_old" AS ENUM('CONFIRM_REGISTER', 'MESSAGE_RECEIVED', 'RESET_PASSWORD', 'INVITATION', 'PROJECT_CREATED', 'ESTIMATE_READY', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_REMINDER_FOR_CUSTOMER', 'SITE_VISIT_SCHEDULE_CHANGED', 'RECEIVED_FINAL_PROPOSAL', 'FINAL_PROPOSAL_UPDATED', 'FINAL_PROPOSAL_ACCEPTED', 'MILESTONE_PAYMENT_REQUESTED', 'RECEIVED_MILESTONE_PAYMENT', 'PICK_PAVERS_SCHEDULED', 'PICK_PAVERS_SCHEDULE_CHANGED', 'FINAL_MILESTONE_PAYMENT_REQUESTED', 'FINAL_MILESTONE_MODIFIED', 'TESTIMONIAL_REQUEST', 'DEPOSIT_MILESTONE_UPDATED', 'NEW_PROJECT_REGISTERED', 'ESTIMATE_REMINDER', 'ESTIMATE_ACCEPTED', 'SITE_VISIT_REMINDER_FOR_CONTRACTOR', 'SUBMIT_PROPOSAL_REMINDER', 'DEPOSIT_MADE', 'MILESTONE_PAID', 'CONTRACT_READY', 'CONTRACT_SIGNED', 'SITE_VISIT_SCHEDULE_CHANGE_REQUEST', 'PICK_PAVERS_SCHEDULE_CHANGE_REQUEST', 'ESTIMATE_DECLINED', 'FINAL_PROPOSAL_DECLINED', 'CHANGE_EMAIL')`, undefined);
    await queryRunner.query(`ALTER TABLE "email_log" ALTER COLUMN "type" TYPE "email_log_type_enum_old" USING "type"::"text"::"email_log_type_enum_old"`, undefined);
    await queryRunner.query(`DROP TYPE "email_log_type_enum"`, undefined);
    await queryRunner.query(`ALTER TYPE "email_log_type_enum_old" RENAME TO  "email_log_type_enum"`, undefined);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
    await queryRunner.query(`DROP TABLE "material_request"`, undefined);
    await queryRunner.query(`DROP TYPE "material_request_type_enum"`, undefined);
  }

}
