-- CreateTable
CREATE TABLE "public"."ProductAnalytics" (
    "id" SERIAL NOT NULL,
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productTitle" TEXT NOT NULL,
    "productImageUrl" TEXT,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalProductClicks" INTEGER NOT NULL DEFAULT 0,
    "shared" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StoreAnalytics" (
    "shop" TEXT NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalFitsShared" INTEGER NOT NULL DEFAULT 0,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "totalFitShared" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreAnalytics_pkey" PRIMARY KEY ("shop")
);

-- CreateIndex
CREATE INDEX "ProductAnalytics_shop_idx" ON "public"."ProductAnalytics"("shop");

-- CreateIndex
CREATE INDEX "ProductAnalytics_productId_idx" ON "public"."ProductAnalytics"("productId");

-- CreateIndex
CREATE INDEX "ProductAnalytics_createdAt_idx" ON "public"."ProductAnalytics"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAnalytics_shop_productId_key" ON "public"."ProductAnalytics"("shop", "productId");
