-- CreateTable
CREATE TABLE "Ville" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "codePostal" VARCHAR(20),

    CONSTRAINT "Ville_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veterinaire" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "adresse" VARCHAR(255) NOT NULL,
    "telephone" VARCHAR(20),
    "horaires" VARCHAR(255),
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "website" VARCHAR(255),
    "villeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Veterinaire_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Veterinaire" ADD CONSTRAINT "Veterinaire_villeId_fkey" FOREIGN KEY ("villeId") REFERENCES "Ville"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
