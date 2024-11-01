/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber,status]` on the table `queue_pools` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `queue_pools_phoneNumber_key` ON `queue_pools`;

-- CreateTable
CREATE TABLE `banners` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `banners_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `queue_pools_phoneNumber_status_key` ON `queue_pools`(`phoneNumber`, `status`);
