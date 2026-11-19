import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * AddUserPasswordHash1760000000015
 *
 * Adds a `passwordHash` column to the `users` table to support email+password
 * authentication alongside the existing wallet-address flow.
 *
 * The column is nullable so that existing wallet-only accounts are unaffected.
 * Rows without a hash cannot authenticate via the password flow; only the
 * wallet-address flow remains available to them until they set a password.
 *
 * Fixes: #6 — passwords must be stored using an adaptive hash (bcrypt) rather
 * than a plain or weakly-hashed value.
 */
export class AddUserPasswordHash1760000000015 implements MigrationInterface {
  name = "AddUserPasswordHash1760000000015";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 72 characters is bcrypt's internal limit; 72 chars of output from
    // bcrypt.hash() is the standard storage size.
    await queryRunner.query(`
      ALTER TABLE "users"
        ADD COLUMN "passwordHash" character varying(72) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "passwordHash"
    `);
  }
}
