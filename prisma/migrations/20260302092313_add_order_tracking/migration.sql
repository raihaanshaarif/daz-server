-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "Buyer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Factory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "shipDate" TIMESTAMP(3),
    "dept" TEXT,
    "style" TEXT,
    "color" TEXT,
    "lot" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "factoryUnitPrice" DOUBLE PRECISION,
    "totalFactoryPrice" DOUBLE PRECISION,
    "dazCommission" DOUBLE PRECISION,
    "discountFactory" DOUBLE PRECISION,
    "discountFromDaz" DOUBLE PRECISION,
    "discountRemark" TEXT,
    "finalDazCommission" DOUBLE PRECISION,
    "paymentTerm" TEXT,
    "yarnBooking" BOOLEAN NOT NULL DEFAULT false,
    "labdipYarndip" BOOLEAN NOT NULL DEFAULT false,
    "printStrikeOff" BOOLEAN NOT NULL DEFAULT false,
    "ppSample" BOOLEAN NOT NULL DEFAULT false,
    "bulkFabric" BOOLEAN NOT NULL DEFAULT false,
    "cutting" BOOLEAN NOT NULL DEFAULT false,
    "printing" BOOLEAN NOT NULL DEFAULT false,
    "swing" BOOLEAN NOT NULL DEFAULT false,
    "finishing" BOOLEAN NOT NULL DEFAULT false,
    "shipmentSample" BOOLEAN NOT NULL DEFAULT false,
    "inspection" BOOLEAN NOT NULL DEFAULT false,
    "exFactory" BOOLEAN NOT NULL DEFAULT false,
    "overallRemarks" TEXT,
    "commissionStatus" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "commissionAmount" DOUBLE PRECISION,
    "buyerId" INTEGER NOT NULL,
    "factoryId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Insert sample data
INSERT INTO "Buyer" ("name", "brand", "createdAt", "updatedAt") VALUES 
('Nike', 'Nike', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
('Adidas', 'Adidas', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "Factory" ("name", "createdAt", "updatedAt") VALUES 
('Bangladesh Textiles', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
('Vietnam Garments', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
