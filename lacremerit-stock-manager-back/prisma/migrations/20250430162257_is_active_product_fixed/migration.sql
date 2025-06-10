/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isAvailable",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
