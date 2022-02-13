import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1644774438899 implements MigrationInterface {
  name = 'User1644774438899';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "pdfFile" TO "pdf"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "pdf" TO "pdfFile"`,
    );
  }
}
