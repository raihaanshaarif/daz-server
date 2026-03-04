/*
  Warnings:

  - The values [NOT_SENT,NEW,RESPONDED,NEGOTIATING,CLOSED_LOST] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - The `yarnBooking` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `labdipYarndip` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `printStrikeOff` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ppSample` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bulkFabric` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cutting` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `printing` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `swing` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `finishing` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `shipmentSample` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `inspection` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `exFactory` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `Buyer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Factory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('NOT_CONTACTED', 'CONTACTED', 'FOLLOW_UP_SENT', 'ENGAGED', 'INTERESTED', 'QUALIFIED', 'CATALOG_SENT', 'SAMPLE_REQUESTED', 'SAMPLE_SENT', 'PRICE_NEGOTIATION', 'CLOSED_WON', 'REPEAT_BUYER', 'NON_RESPONSIVE', 'REENGAGED', 'DORMANT', 'NOT_INTERESTED', 'INVALID', 'DO_NOT_CONTACT');
ALTER TABLE "public"."Contact" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Contact" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "public"."Status_old";
ALTER TABLE "Contact" ALTER COLUMN "status" SET DEFAULT 'NOT_CONTACTED';
COMMIT;

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "lastContactedAt" TIMESTAMP(3),
ADD COLUMN     "lastRepliedAt" TIMESTAMP(3),
ADD COLUMN     "nextFollowUpAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'NOT_CONTACTED';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "yarnBooking",
ADD COLUMN     "yarnBooking" TIMESTAMP(3),
DROP COLUMN "labdipYarndip",
ADD COLUMN     "labdipYarndip" TIMESTAMP(3),
DROP COLUMN "printStrikeOff",
ADD COLUMN     "printStrikeOff" TIMESTAMP(3),
DROP COLUMN "ppSample",
ADD COLUMN     "ppSample" TIMESTAMP(3),
DROP COLUMN "bulkFabric",
ADD COLUMN     "bulkFabric" TIMESTAMP(3),
DROP COLUMN "cutting",
ADD COLUMN     "cutting" TIMESTAMP(3),
DROP COLUMN "printing",
ADD COLUMN     "printing" TIMESTAMP(3),
DROP COLUMN "swing",
ADD COLUMN     "swing" TIMESTAMP(3),
DROP COLUMN "finishing",
ADD COLUMN     "finishing" TIMESTAMP(3),
DROP COLUMN "shipmentSample",
ADD COLUMN     "shipmentSample" TIMESTAMP(3),
DROP COLUMN "inspection",
ADD COLUMN     "inspection" TIMESTAMP(3),
DROP COLUMN "exFactory",
ADD COLUMN     "exFactory" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_name_key" ON "Buyer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Factory_name_key" ON "Factory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
