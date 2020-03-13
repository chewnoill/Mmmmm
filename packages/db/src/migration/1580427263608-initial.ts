import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1580427263608 implements MigrationInterface {
  name = "initial1580427263608";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "user_collections_collection" ("userId" uuid NOT NULL, "collectionId" uuid NOT NULL, CONSTRAINT "PK_c41cfcccb45c9916d110d98b1a1" PRIMARY KEY ("userId", "collectionId"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f3bd7583545751727726908fe8" ON "user_collections_collection" ("userId") `,
      undefined
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ab8ff4e83beda8962c93c88a5c" ON "user_collections_collection" ("collectionId") `,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_collections_collection" ADD CONSTRAINT "FK_f3bd7583545751727726908fe8d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_collections_collection" ADD CONSTRAINT "FK_ab8ff4e83beda8962c93c88a5c2" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user_collections_collection" DROP CONSTRAINT "FK_ab8ff4e83beda8962c93c88a5c2"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_collections_collection" DROP CONSTRAINT "FK_f3bd7583545751727726908fe8d"`,
      undefined
    );
    await queryRunner.query(
      `DROP INDEX "IDX_ab8ff4e83beda8962c93c88a5c"`,
      undefined
    );
    await queryRunner.query(
      `DROP INDEX "IDX_f3bd7583545751727726908fe8"`,
      undefined
    );
    await queryRunner.query(
      `DROP TABLE "user_collections_collection"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "collection"`, undefined);
    await queryRunner.query(`DROP TABLE "user"`, undefined);
  }
}
