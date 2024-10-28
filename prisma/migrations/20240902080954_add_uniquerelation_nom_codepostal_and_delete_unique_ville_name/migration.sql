/*
  Warnings:

  - A unique constraint covering the columns `[nom,codePostal]` on the table `Ville` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ville_nom_key";

-- CreateIndex
CREATE UNIQUE INDEX "Ville_nom_codePostal_key" ON "Ville"("nom", "codePostal");
