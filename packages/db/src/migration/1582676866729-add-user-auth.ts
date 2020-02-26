import { MigrationInterface, QueryRunner } from "typeorm";

export class addUserAuth1582676866729 implements MigrationInterface {
  name = "addUserAuth1582676866729";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "refresh_token" character varying`,
      undefined
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "refresh_token"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "email"`,
      undefined
    );
  }
}
