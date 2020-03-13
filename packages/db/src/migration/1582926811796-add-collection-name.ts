import { MigrationInterface, QueryRunner } from "typeorm";

export class addCollectionName1582926811796 implements MigrationInterface {
  name = "addCollectionName1582926811796";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "collection" ADD "name" character varying NOT NULL`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "collection" DROP COLUMN "name"`,
      undefined
    );
  }
}
