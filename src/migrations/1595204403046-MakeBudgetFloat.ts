import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeBudgetFloat1595204403046 implements MigrationInterface {
    name = 'MakeBudgetFloat1595204403046';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "budget" TYPE numeric(17, 2)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "budget" TYPE numeric`, undefined);
    }

}
