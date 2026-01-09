/*
  Warnings:

  - Added the required column `activityType` to the `store_activity_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."store_activity_logs" ADD COLUMN     "activityType" TEXT NOT NULL;
