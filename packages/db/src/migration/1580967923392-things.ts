import { MigrationInterface, QueryRunner } from "typeorm";

export class things1580967923392 implements MigrationInterface {
  name = "things1580967923392";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "thing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "collectionId" uuid, CONSTRAINT "PK_e7757c5911e20acd09faa22d1ac" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "thing" ADD CONSTRAINT "FK_db16945eb0475aecc37b2e8a7d8" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "thing" DROP CONSTRAINT "FK_db16945eb0475aecc37b2e8a7d8"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "thing"`, undefined);
  }
}
