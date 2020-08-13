import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEndDateToConsultation1591806089498 implements MigrationInterface {
  name = 'AddEndDateToConsultation1591806089498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "consultation" RENAME COLUMN "datetime" to "from"`, undefined);
    await queryRunner.query(`ALTER TABLE "consultation" ADD "to" TIMESTAMP DEFAULT null`, undefined);
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
    await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "consultation" DROP COLUMN "to"`, undefined);
    await queryRunner.query(`ALTER TABLE "consultation" RENAME COLUMN "from" to "datetime" `, undefined);
  }

}
