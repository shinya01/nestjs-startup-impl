import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedData1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const micaUser = (await queryRunner.query(`
      INSERT INTO "user" (email, "externalId")
      VALUES ('mica@fox.jp', NULL)
      RETURNING id
    `)) as { id: number }[];
    const erinUser = (await queryRunner.query(`
      INSERT INTO "user" (email, "externalId")
      VALUES ('erin@forest.jp', NULL)
      RETURNING id
    `)) as { id: number }[];
    const aquaUser = (await queryRunner.query(`
      INSERT INTO "user" (email, "externalId")
      VALUES ('aqua@river.jp', NULL)
      RETURNING id
    `)) as { id: number }[];

    const micaId = micaUser[0].id;
    const erinId = erinUser[0].id;
    const aquaId = aquaUser[0].id;

    await queryRunner.query(`
      INSERT INTO "user_info" (name, "userId")
      VALUES
        ('ミカ', ${micaId}),
        ('エリン', ${erinId}),
        ('アクア', ${aquaId})
    `);

    await queryRunner.query(`
      INSERT INTO "article" (title, content, "authorId")
      VALUES
        ('はじめてのNestJS', 'NestJSはとっても楽しい！', ${micaId}),
        ('PostgreSQL入門', 'データベースの基本を学ぼう！', ${erinId})
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "article"`);
    await queryRunner.query(`DELETE FROM "user_info"`);
    await queryRunner.query(`DELETE FROM "user"`);
  }
}
