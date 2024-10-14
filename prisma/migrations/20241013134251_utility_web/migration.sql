/*
  Warnings:

  - Added the required column `name` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customers` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `utilities` (
    `id` VARCHAR(191) NOT NULL,
    `appName` VARCHAR(191) NULL,
    `logoSmall` VARCHAR(191) NULL,
    `logoFull` VARCHAR(191) NULL,
    `textColor` VARCHAR(191) NULL DEFAULT '#fffff',
    `bgColor` VARCHAR(191) NULL DEFAULT '#000000',
    `mainEmail` VARCHAR(191) NULL,
    `mainWhatsApp` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `utilities_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
