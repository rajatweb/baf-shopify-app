/*
  Warnings:

  - The primary key for the `ProductAnalytics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductAnalytics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ProductAnalytics" DROP CONSTRAINT "ProductAnalytics_pkey",
DROP COLUMN "id";
