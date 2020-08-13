import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameContactUsToLead1593536173949 implements MigrationInterface {
    name = 'RenameContactUsToLead1593536173949';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_us_message" rename to "lead"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" rename to "contact_us_message"`, undefined);
    }

}
