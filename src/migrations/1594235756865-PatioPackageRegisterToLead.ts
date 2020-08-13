import {MigrationInterface, QueryRunner} from "typeorm";

export class PatioPackageRegisterToLead1594235756865 implements MigrationInterface {
    name = 'PatioPackageRegisterToLead1594235756865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "customer_profile_sourcefoundus_enum" AS ENUM('REFERRAL', 'GOOGLE', 'INSTAGRAM', 'FACEBOOK', 'PINTEREST', 'LINKEDIN', 'PAST_CUSTOMER', 'HOME_SHOW', 'SIGNAGE', 'OTHER')`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_profile" ADD "sourceFoundUs" "customer_profile_sourcefoundus_enum"`, undefined);
        await queryRunner.query(`CREATE TYPE "lead_type_enum" AS ENUM('CONTACT_US', 'PATIO_PACKAGE', 'LANDING_PAGE', 'OTHER')`, undefined);
        await queryRunner.query(`ALTER TABLE "lead" ADD "type" "lead_type_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "lead" ADD "patioPackageId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "lead" ADD CONSTRAINT "UQ_5d224f2652c909eaefab71d5af4" UNIQUE ("patioPackageId")`, undefined);
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
        await queryRunner.query(`ALTER TABLE "lead" ADD CONSTRAINT "FK_5d224f2652c909eaefab71d5af4" FOREIGN KEY ("patioPackageId") REFERENCES "patio_package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" DROP CONSTRAINT "FK_5d224f2652c909eaefab71d5af4"`, undefined);
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
        await queryRunner.query(`ALTER TABLE "lead" DROP CONSTRAINT "UQ_5d224f2652c909eaefab71d5af4"`, undefined);
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "patioPackageId"`, undefined);
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "type"`, undefined);
        await queryRunner.query(`DROP TYPE "lead_type_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "customer_profile" DROP COLUMN "sourceFoundUs"`, undefined);
        await queryRunner.query(`DROP TYPE "customer_profile_sourcefoundus_enum"`, undefined);
    }

}
