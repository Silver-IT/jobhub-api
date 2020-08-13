import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMaterialOrder1595262950886 implements MigrationInterface {
    name = 'AddMaterialOrder1595262950886';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "material_order_item_amounttype_enum" AS ENUM('BAGS', 'YARDS', 'ROLL', 'SQUARE_FEET', 'LINER_FEET', 'PALLETS', 'TUBES', 'UNIT')`, undefined);
        await queryRunner.query(`CREATE TABLE "material_order_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "amount" character varying NOT NULL, "amountType" "material_order_item_amounttype_enum", "color" character varying NOT NULL, "name" character varying, "brand" character varying, "style" character varying, "requestDate" TIMESTAMP, "comment" character varying, "groupId" uuid, CONSTRAINT "PK_478ca918cd6e9faca1b04c360d7" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "material_order_group_layouttype_enum" AS ENUM('STEPS', 'SITTING_WALL', 'PILLARS', 'LIGHTING', 'PATIO', 'RAISED_PATIO', 'WALKWAY', 'RETAINING_WALL', 'POOL_PATIO', 'FIRE_PIT', 'DRIVEWAY_PARKING', 'VENEER', 'FIREPLACE', 'OUTDOOR_KITCHEN', 'CLEANING_SANDING', 'MINOR_REPAIR', 'LANDSCAPING_PLANTS', 'OTHER')`, undefined);
        await queryRunner.query(`CREATE TYPE "material_order_group_grouptype_enum" AS ENUM('LAYOUT', 'LAYOUT_ACCESSORY', 'BULK', 'OTHER')`, undefined);
        await queryRunner.query(`CREATE TABLE "material_order_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "layoutType" "material_order_group_layouttype_enum", "groupType" "material_order_group_grouptype_enum" NOT NULL, "projectId" uuid, CONSTRAINT "PK_10e373530f4c29b3e42bcf705be" PRIMARY KEY ("id"))`, undefined);
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
        await queryRunner.query(`ALTER TABLE "material_order_item" ADD CONSTRAINT "FK_28ab74a94eeb16425b36b62c341" FOREIGN KEY ("groupId") REFERENCES "material_order_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "material_order_group" ADD CONSTRAINT "FK_b1107068abe73d420900800450b" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "material_order_group" DROP CONSTRAINT "FK_b1107068abe73d420900800450b"`, undefined);
        await queryRunner.query(`ALTER TABLE "material_order_item" DROP CONSTRAINT "FK_28ab74a94eeb16425b36b62c341"`, undefined);
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
        await queryRunner.query(`DROP TABLE "material_order_group"`, undefined);
        await queryRunner.query(`DROP TYPE "material_order_group_grouptype_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "material_order_group_layouttype_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "material_order_item"`, undefined);
        await queryRunner.query(`DROP TYPE "material_order_item_amounttype_enum"`, undefined);
    }

}
