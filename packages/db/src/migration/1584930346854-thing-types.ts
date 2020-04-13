import { MigrationInterface, QueryRunner } from "typeorm";

export class thingTypes1584930346854 implements MigrationInterface {
  name = "thingTypes1584930346854";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "thing_type_enum" AS ENUM('0', '1')`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "thing" ADD "type" "thing_type_enum" NOT NULL DEFAULT '1'`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "thing" DROP COLUMN "type"`,
      undefined
    );
    await queryRunner.query(`DROP TYPE "thing_type_enum"`, undefined);
  }
}
