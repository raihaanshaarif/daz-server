/*
  Warnings:

  - The values [SENT,PENDING,BUYER_REPLIED,BUYER_NOT_INTERESTED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('NOT_SENT', 'NEW', 'CONTACTED', 'RESPONDED', 'QUALIFIED', 'NEGOTIATING', 'CLOSED_WON', 'CLOSED_LOST');
ALTER TABLE "public"."Contact" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Contact" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "public"."Status_old";
ALTER TABLE "Contact" ALTER COLUMN "status" SET DEFAULT 'NOT_SENT';
COMMIT;
