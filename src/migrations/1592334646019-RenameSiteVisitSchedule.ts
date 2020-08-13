import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameSiteVisitSchedule1592334646019 implements MigrationInterface {
    name = 'RenameSiteVisitSchedule1592334646019';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "site_visit_schedule" RENAME TO "schedule"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" RENAME TO "site_visit_schedule"`, undefined);
    }

}
