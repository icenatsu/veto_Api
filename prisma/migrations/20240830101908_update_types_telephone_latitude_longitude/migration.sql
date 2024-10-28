/*
  Warnings:

  - Made the column `telephone` on table `Veterinaire` required. This step will fail if there are existing NULL values in that column.
  - Made the column `horaires` on table `Veterinaire` required. This step will fail if there are existing NULL values in that column.
  - Made the column `latitude` on table `Veterinaire` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `Veterinaire` required. This step will fail if there are existing NULL values in that column.
  - Made the column `codePostal` on table `Ville` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Veterinaire" ALTER COLUMN "telephone" SET NOT NULL,
ALTER COLUMN "horaires" SET NOT NULL,
ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "latitude" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "longitude" SET NOT NULL,
ALTER COLUMN "longitude" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Ville" ALTER COLUMN "codePostal" SET NOT NULL;
