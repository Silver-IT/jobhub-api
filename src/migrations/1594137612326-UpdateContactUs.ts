import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateContactUs1594137612326 implements MigrationInterface {
    name = 'UpdateContactUs1594137612326';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" ADD "address" character varying NOT NULL DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "lead" ADD "latitude" numeric(20,15)`, undefined);
        await queryRunner.query(`ALTER TABLE "lead" ADD "longitude" numeric(20,15)`, undefined);
        await queryRunner.query(`CREATE TYPE "lead_sourcefoundus_enum" AS ENUM('REFERRAL', 'GOOGLE', 'INSTAGRAM', 'FACEBOOK', 'PINTEREST', 'LINKEDIN', 'PAST_CUSTOMER', 'HOME_SHOW', 'SIGNAGE', 'OTHER')`, undefined);
        await queryRunner.query(`ALTER TABLE "lead" ADD "sourceFoundUs" "lead_sourcefoundus_enum"`, undefined);
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
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "sourceFoundUs"`, undefined);
        await queryRunner.query(`DROP TYPE "lead_sourcefoundus_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "longitude"`, undefined);
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "latitude"`, undefined);
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "address"`, undefined);
    }

}
