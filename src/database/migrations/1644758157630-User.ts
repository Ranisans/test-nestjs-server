import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1644758157630 implements MigrationInterface {
  name = 'User1644758157630';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "pdfFile" bytea`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pdfFile"`);
  }
}
