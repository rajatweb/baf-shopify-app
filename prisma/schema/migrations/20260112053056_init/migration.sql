-- CreateEnum
CREATE TYPE "public"."AssetType" AS ENUM ('IMAGE', 'AUDIO');

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
CREATE UNIQUE INDEX "ShopAsset_shopifyFileId_key" ON "public"."ShopAsset"("shopifyFileId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopAsset_url_key" ON "public"."ShopAsset"("url");

-- CreateIndex
CREATE INDEX "ShopAsset_shop_idx" ON "public"."ShopAsset"("shop");
