/*
  Warnings:

  - You are about to drop the column `playingHistoriesId` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `queue_pools` table. All the data in the column will be lost.
  - You are about to drop the `playing_histories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `queue_pools` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `queue_pools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `queue_pools` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `customers` DROP FOREIGN KEY `customers_playingHistoriesId_fkey`;

-- DropForeignKey
ALTER TABLE `queue_pools` DROP FOREIGN KEY `queue_pools_customerId_fkey`;

-- AlterTable
ALTER TABLE `customers` DROP COLUMN `playingHistoriesId`;

-- AlterTable
ALTER TABLE `queue_pools` DROP COLUMN `customerId`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `playing_histories`;

-- CreateIndex
CREATE UNIQUE INDEX `queue_pools_phoneNumber_key` ON `queue_pools`(`phoneNumber`);
