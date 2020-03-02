import { MigrationInterface, QueryRunner } from "typeorm";

export class addThingValue1583123176421 implements MigrationInterface {
  name = "addThingValue1583123176421";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "thing" ADD "value" character varying NOT NULL`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "thing" DROP COLUMN "value"`,
      undefined
    );
  }
}
