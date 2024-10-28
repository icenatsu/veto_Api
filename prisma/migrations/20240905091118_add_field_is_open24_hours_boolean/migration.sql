/*
  Warnings:

  - Added the required column `isOpen24Hours` to the `Veterinaire` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Veterinaire" ADD COLUMN     "isOpen24Hours" BOOLEAN NOT NULL;
