import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPageVisitHistory1591965210595 implements MigrationInterface {
    name = 'AddPageVisitHistory1591965210595';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "page_visit_history_page_enum" AS ENUM('BRIEF_PAGE', 'ESTIMATE_PAGE', 'PROPOSAL_PAGE', 'CONTRACT_PAGE', 'PAYMENT_PAGE', 'HOME_PAGE', 'REQUEST_ESTIMATE_PAGE', 'CONTACT_US_PAGE', 'IDEA_BOARD_PAGE', 'SERVICES_PAGE', 'ABOUT_US_PAGE', 'PROJECT_MANAGEMENT_PAGE', 'INSTALLATION_PROCESS_PAGE', 'PATIO_PACKAGES_PAGE', 'PRIVACY_POLICY_PAGE', 'LEGAL_NOTICE_PAGE')`, undefined);
        await queryRunner.query(`CREATE TABLE "page_visit_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "page" "page_visit_history_page_enum" NOT NULL, "sub" character varying DEFAULT null, CONSTRAINT "PK_bb4fcb0cbe33420439c0b5f9be2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."customer_visit_history_page_enum" RENAME TO "customer_visit_history_page_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "customer_visit_history_page_enum" AS ENUM('BRIEF_PAGE', 'ESTIMATE_PAGE', 'PROPOSAL_PAGE', 'CONTRACT_PAGE', 'PAYMENT_PAGE', 'HOME_PAGE', 'REQUEST_ESTIMATE_PAGE', 'CONTACT_US_PAGE', 'IDEA_BOARD_PAGE', 'SERVICES_PAGE', 'ABOUT_US_PAGE', 'PROJECT_MANAGEMENT_PAGE', 'INSTALLATION_PROCESS_PAGE', 'PATIO_PACKAGES_PAGE', 'PRIVACY_POLICY_PAGE', 'LEGAL_NOTICE_PAGE')`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_visit_history" ALTER COLUMN "page" TYPE "customer_visit_history_page_enum" USING "page"::"text"::"customer_visit_history_page_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "customer_visit_history_page_enum_old"`, undefined);
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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
        await queryRunner.query(`CREATE TYPE "customer_visit_history_page_enum_old" AS ENUM('BRIEF_PAGE', 'ESTIMATE_PAGE', 'PROPOSAL_PAGE', 'CONTRACT_PAGE', 'PAYMENT_PAGE')`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_visit_history" ALTER COLUMN "page" TYPE "customer_visit_history_page_enum_old" USING "page"::"text"::"customer_visit_history_page_enum_old"`, undefined);
        await queryRunner.query(`DROP TYPE "customer_visit_history_page_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "customer_visit_history_page_enum_old" RENAME TO  "customer_visit_history_page_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`DROP TABLE "page_visit_history"`, undefined);
        await queryRunner.query(`DROP TYPE "page_visit_history_page_enum"`, undefined);
    }

}
