/*
  Warnings:

  - You are about to alter the column `phone` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(16)`.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `refreshToken` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(16) NULL;
