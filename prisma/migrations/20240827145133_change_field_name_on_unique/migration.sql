/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Ville` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ville_nom_key" ON "Ville"("nom");
