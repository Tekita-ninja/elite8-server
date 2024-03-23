/*
  Warnings:

  - You are about to drop the column `categoriesId` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_categoriesId_fkey`;

-- AlterTable
ALTER TABLE `couriers` MODIFY `value` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `categoriesId`,
    MODIFY `categoryId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
