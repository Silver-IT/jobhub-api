import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameProjectTimelineTypeEnumValue1591851922199 implements MigrationInterface {
    name = 'RenameProjectTimelineTypeEnumValue1591851922199';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."estimate_timelinetype_enum" RENAME TO "estimate_timelinetype_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "estimate_timelinetype_enum" AS ENUM('IMMEDIATELY', 'ABOUT_30_DAYS', 'ABOUT_1_TO_3_MONTHS', 'ABOUT_3_TO_MONTHS', 'ABOUT_3_TO_6_MONTHS', 'MORE_THEN_6_MONTHS', 'MORE_THAN_6_MONTHS')`, undefined);
        await queryRunner.query(`ALTER TABLE "estimate" ALTER COLUMN "timelineType" TYPE "estimate_timelinetype_enum" USING "timelineType"::"text"::"estimate_timelinetype_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "estimate_timelinetype_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."project_timelinetype_enum" RENAME TO "project_timelinetype_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "project_timelinetype_enum" AS ENUM('IMMEDIATELY', 'ABOUT_30_DAYS', 'ABOUT_1_TO_3_MONTHS', 'ABOUT_3_TO_MONTHS', 'ABOUT_3_TO_6_MONTHS', 'MORE_THEN_6_MONTHS', 'MORE_THAN_6_MONTHS')`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "timelineType" TYPE "project_timelinetype_enum" USING "timelineType"::"text"::"project_timelinetype_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "project_timelinetype_enum_old"`, undefined);
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
        await queryRunner.query(`CREATE TYPE "project_timelinetype_enum_old" AS ENUM('IMMEDIATELY', 'ABOUT_30_DAYS', 'ABOUT_1_TO_3_MONTHS', 'ABOUT_3_TO_MONTHS', 'MORE_THEN_6_MONTHS')`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "timelineType" TYPE "project_timelinetype_enum_old" USING "timelineType"::"text"::"project_timelinetype_enum_old"`, undefined);
        await queryRunner.query(`DROP TYPE "project_timelinetype_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "project_timelinetype_enum_old" RENAME TO  "project_timelinetype_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`CREATE TYPE "estimate_timelinetype_enum_old" AS ENUM('IMMEDIATELY', 'ABOUT_30_DAYS', 'ABOUT_1_TO_3_MONTHS', 'ABOUT_3_TO_MONTHS', 'MORE_THEN_6_MONTHS')`, undefined);
        await queryRunner.query(`ALTER TABLE "estimate" ALTER COLUMN "timelineType" TYPE "estimate_timelinetype_enum_old" USING "timelineType"::"text"::"estimate_timelinetype_enum_old"`, undefined);
        await queryRunner.query(`DROP TYPE "estimate_timelinetype_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "estimate_timelinetype_enum_old" RENAME TO  "estimate_timelinetype_enum"`, undefined);
    }

}
