import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { VeterinarySchema } from "@/utils/schema";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export const GET = async (
  req: NextRequest,
  { params }: { params: { veterinaryId: string } }
) => {
  try {

    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Vous devez être authentifié pour accéder aux informations de ce vétérinaire." },
        { status: 400 }
      );
    }

    const veterinary = await prisma.veterinaire.findUnique({
      where: { id: parseInt(params.veterinaryId) },
      select: {
        id: true,
        nom: true,
        adresse: true,
        telephone: true,
        horaires: true,
        latitude: true,
        longitude: true,
        website: true,
        villeId: true,
        isOpen24Hours: true,
        ville: {
          select: {
            id: true,
            nom: true,
            codePostal: true,
          },
        },
      },
    });

    if (!veterinary) {
      return NextResponse.json(
        { message: "La clinique vétérinaire n'existe pas." },
        { status: 404 }
      );
    }

    // Validation des données avec le schéma
    const validatedData = VeterinarySchema.parse(veterinary);

    return NextResponse.json(validatedData, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération du vétérinaire:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Erreur de validation.",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { veterinaryId: string } }
) => {
  try {

    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Vous devez être authentifié pour modifier une fiche." },
        { status: 400 }
      );
    }

    if (session.user.role === "USER") {
      return NextResponse.json(
        {
          message:
            "Vous devez être un modérateur ou un administrateur pour modifier une fiche vétérinaire.",
        },
        { status: 400 }
      );
    }

    const veterinaryId = parseInt(params.veterinaryId);
    if (isNaN(veterinaryId)) {
      return NextResponse.json(
        { message: "ID du vétérinaire invalide." },
        { status: 400 }
      );
    }

    const data = await req.json();

    const mappedData = {
      id: veterinaryId,
      nom: data.clinicName,
      adresse: data.streetName,
      telephone: data.phone,
      horaires: data.openingHours,
      latitude: data.latitude,
      longitude: data.longitude,
      website: data.website || null,
      isOpen24Hours: data.isOpen24Hours,
      ville: {
        nom: data.city,
        codePostal: data.postalCode,
      },
    };

    const validatedData = VeterinarySchema.parse(mappedData);

    //Validation de l'ID dans le corps de la requête
    if (parseInt(params.veterinaryId) !== validatedData.id) {
      return NextResponse.json(
        {
          message:
            "Les ID ne correspondent pas. L'id de l'url doit correspondre à l'id de la requête.",
        },
        { status: 400 }
      );
    }

    // Vérification ou création de la ville
    let ville = await prisma.ville.findUnique({
      where: {
        nom_codePostal: {
          nom: validatedData.ville.nom,
          codePostal: validatedData.ville.codePostal,
        },
      },
    });

    if (!ville) {
      ville = await prisma.ville.create({
        data: {
          nom: validatedData.ville.nom,
          codePostal: validatedData.ville.codePostal,
        },
      });
    }

    // // Mise à jour du vétérinaire
    const updatedVeterinary = await prisma.veterinaire.update({
      where: { id: veterinaryId },
      data: {
        nom: validatedData.nom,
        adresse: validatedData.adresse,
        telephone: validatedData.telephone,
        horaires: validatedData.horaires,
        website: validatedData.website,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        villeId: ville.id, // Lien vers la ville mise à jour ou créée
        isOpen24Hours: validatedData.isOpen24Hours,
      },
      include: {
        ville: true, // Inclure les informations de la ville dans la réponse
      },
    });

    return NextResponse.json(updatedVeterinary, { status: 200 });
  } catch (error: any) {
    console.error(error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Erreur de validation.",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Erreur interne du serveur.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { veterinaryId: string } }
) => {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Vous devez être authentifié pour supprimer une clinique vétérinaire." },
        { status: 400 }
      );
    }

    if (session.user.role === "USER") {
      return NextResponse.json(
        {
          message:
            "Vous devez être un modérateur ou un administrateur pour supprimer une clinique vétérinaire.",
        },
        { status: 400 }
      );
    }

    if (!parseInt(params.veterinaryId)) {
      return NextResponse.json(
        { message: "ID du vétérinaire manquant." },
        { status: 400 }
      );
    }

    const veterinary = await prisma.veterinaire.findUnique({
      where: { id: parseInt(params.veterinaryId) },
    });

    if (!veterinary) {
      return NextResponse.json(
        { message: "Vétérinaire non trouvé." },
        { status: 404 }
      );
    }

    await prisma.veterinaire.delete({
      where: { id: parseInt(params.veterinaryId) },
    });

    return NextResponse.json(
      { message: "Vétérinaire supprimé avec succès." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Erreur de validation.",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Erreur interne du serveur.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
