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
    "collaborator" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_activity_logs_pkey" PRIMARY KEY ("id")
);

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

-- AddForeignKey
ALTER TABLE "public"."StoreSettings" ADD CONSTRAINT "StoreSettings_shop_fkey" FOREIGN KEY ("shop") REFERENCES "public"."Store"("shop") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."store_activity_logs" ADD CONSTRAINT "store_activity_logs_shop_fkey" FOREIGN KEY ("shop") REFERENCES "public"."Store"("shop") ON DELETE CASCADE ON UPDATE CASCADE;
