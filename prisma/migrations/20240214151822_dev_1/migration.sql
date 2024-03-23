-- DropForeignKey
ALTER TABLE `varian` DROP FOREIGN KEY `varian_productId_fkey`;

-- AddForeignKey
ALTER TABLE `varian` ADD CONSTRAINT `varian_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subvarian` ADD CONSTRAINT `subvarian_varianId_fkey` FOREIGN KEY (`varianId`) REFERENCES `varian`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
