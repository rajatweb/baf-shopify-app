-- CreateEnum
CREATE TYPE "public"."AssetType" AS ENUM ('IMAGE', 'AUDIO');

-- CreateTable
CREATE TABLE "public"."ProductAnalytics" (
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productTitle" TEXT NOT NULL,
    "productImageUrl" TEXT,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalProductClicks" INTEGER NOT NULL DEFAULT 0,
    "shared" INTEGER NOT NULL DEFAULT 0,
    "addToCartCount" INTEGER NOT NULL DEFAULT 0,
    "purchaseCount" INTEGER NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Store" (
    "shop" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("shop")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StoreSettings" (
    "shop" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSettings_pkey" PRIMARY KEY ("shop")
);

-- CreateTable
CREATE TABLE "public"."store_activity_logs" (
    "id" SERIAL NOT NULL,
    "shop" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "account_owner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "collaborator" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShopAsset" (
    "id" TEXT NOT NULL,
    "shopifyFileId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "public"."AssetType" NOT NULL,
    "mimeType" TEXT,
    "shop" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductAnalytics_shop_idx" ON "public"."ProductAnalytics"("shop");

-- CreateIndex
CREATE INDEX "ProductAnalytics_productId_idx" ON "public"."ProductAnalytics"("productId");

-- CreateIndex
CREATE INDEX "ProductAnalytics_createdAt_idx" ON "public"."ProductAnalytics"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAnalytics_shop_productId_key" ON "public"."ProductAnalytics"("shop", "productId");

-- CreateIndex
CREATE INDEX "Session_shop_idx" ON "public"."Session"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "StoreSettings_shop_key" ON "public"."StoreSettings"("shop");

-- CreateIndex
CREATE INDEX "store_activity_logs_shop_idx" ON "public"."store_activity_logs"("shop");

-- CreateIndex
CREATE INDEX "store_activity_logs_userId_idx" ON "public"."store_activity_logs"("userId");

-- CreateIndex
CREATE INDEX "store_activity_logs_createdAt_idx" ON "public"."store_activity_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ShopAsset_shopifyFileId_key" ON "public"."ShopAsset"("shopifyFileId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopAsset_url_key" ON "public"."ShopAsset"("url");

-- CreateIndex
CREATE INDEX "ShopAsset_shop_idx" ON "public"."ShopAsset"("shop");

-- AddForeignKey
ALTER TABLE "public"."StoreSettings" ADD CONSTRAINT "StoreSettings_shop_fkey" FOREIGN KEY ("shop") REFERENCES "public"."Store"("shop") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."store_activity_logs" ADD CONSTRAINT "store_activity_logs_shop_fkey" FOREIGN KEY ("shop") REFERENCES "public"."Store"("shop") ON DELETE CASCADE ON UPDATE CASCADE;
