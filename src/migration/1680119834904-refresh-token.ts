import {MigrationInterface, QueryRunner} from "typeorm";

export class user1680119834904 implements MigrationInterface {
    name = 'user1680119834904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_token"
                                 (
                                     "token"      character varying(32) NOT NULL,
                                     "createdAt"  TIMESTAMP             NOT NULL DEFAULT now(),
                                     "validUntil" TIMESTAMP             NOT NULL,
                                     "userId"     uuid,
                                     CONSTRAINT "PK_c31d0a2f38e6e99110df62ab0af" PRIMARY KEY ("token")
                                 )`);
        await queryRunner.query(`ALTER TABLE "refresh_token"
            ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
    }

}
