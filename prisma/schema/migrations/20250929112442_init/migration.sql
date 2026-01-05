-- CreateTable
CREATE TABLE "public"."FeatureRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "category" TEXT NOT NULL DEFAULT 'general',
    "userEmail" TEXT NOT NULL,
    "userName" TEXT,
    "shopDomain" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "comments" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Store" (
    "shop" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "musicPlayerSettings" JSONB,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("shop")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "planName" TEXT NOT NULL DEFAULT 'Free Plan',
    "status" TEXT NOT NULL DEFAULT 'INACTIVE',
    "trialDays" INTEGER,
    "trialEndsAt" TIMESTAMP(3),
    "maxPlaylists" INTEGER NOT NULL DEFAULT 1,
    "maxTracksPerPlaylist" INTEGER NOT NULL DEFAULT 2,
    "maxTotalTracks" INTEGER NOT NULL DEFAULT 2,
    "persistentPlayback" BOOLEAN NOT NULL DEFAULT false,
    "fullCustomization" BOOLEAN NOT NULL DEFAULT false,
    "homepageOnly" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Playlist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Track" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "albumArt" TEXT,
    "audioUrl" TEXT NOT NULL,
    "duration" INTEGER,
    "fileSize" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "albumArtFileId" TEXT,
    "audioFileId" TEXT,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlaylistTrack" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "PlaylistTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeatureRequest_status_idx" ON "public"."FeatureRequest"("status");

-- CreateIndex
CREATE INDEX "FeatureRequest_priority_idx" ON "public"."FeatureRequest"("priority");

-- CreateIndex
CREATE INDEX "FeatureRequest_category_idx" ON "public"."FeatureRequest"("category");

-- CreateIndex
CREATE INDEX "FeatureRequest_shopDomain_idx" ON "public"."FeatureRequest"("shopDomain");

-- CreateIndex
CREATE INDEX "FeatureRequest_createdAt_idx" ON "public"."FeatureRequest"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_shopId_key" ON "public"."Subscription"("shopId");

-- CreateIndex
CREATE INDEX "Subscription_shopId_idx" ON "public"."Subscription"("shopId");

-- CreateIndex
CREATE INDEX "Playlist_storeId_idx" ON "public"."Playlist"("storeId");

-- CreateIndex
CREATE INDEX "Track_storeId_idx" ON "public"."Track"("storeId");

-- CreateIndex
CREATE INDEX "PlaylistTrack_playlistId_idx" ON "public"."PlaylistTrack"("playlistId");

-- CreateIndex
CREATE INDEX "PlaylistTrack_trackId_idx" ON "public"."PlaylistTrack"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistTrack_playlistId_trackId_key" ON "public"."PlaylistTrack"("playlistId", "trackId");

-- CreateIndex
CREATE INDEX "Session_shop_idx" ON "public"."Session"("shop");

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."Store"("shop") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Playlist" ADD CONSTRAINT "Playlist_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("shop") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Track" ADD CONSTRAINT "Track_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("shop") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistTrack" ADD CONSTRAINT "PlaylistTrack_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistTrack" ADD CONSTRAINT "PlaylistTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
