/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Veterinaire` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Veterinaire_nom_key" ON "Veterinaire"("nom");
