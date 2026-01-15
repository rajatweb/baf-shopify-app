-- AlterTable
ALTER TABLE "public"."ProductAnalytics" ADD COLUMN     "addToCartCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "purchaseCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."StoreAnalytics" ADD COLUMN     "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalAddToCartCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalPurchaseCount" INTEGER NOT NULL DEFAULT 0;
