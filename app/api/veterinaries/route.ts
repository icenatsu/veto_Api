import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { VeterinariesSchema, VeterinaryFormSchema } from "@/utils/schema";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Vous devez être authentifié pour accéder à la liste des cliniques vététinaires." },
        { status: 400 }
      );
    }
    
    const veterinaries = await prisma.veterinaire.findMany({
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

    const validatedData = VeterinariesSchema.parse(veterinaries);

    return NextResponse.json(validatedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching veterinaries:", error);

    return NextResponse.json(
      {
        message: { error },
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const session = await auth();
  
    if (!session) {
      return NextResponse.json(
        { message: "Vous devez être authentifié pour ajouter une clinique vétérinaire." },
        { status: 400 }
      );
    }

    if (session.user.role === "USER") {
      return NextResponse.json(
        {
          message:
            "Vous devez être un modérateur ou un administrateur pour ajouter une clinique vétérinaire",
        },
        { status: 400 }
      );
    }

    const validatedData = VeterinaryFormSchema.parse(data);

    let ville = await prisma.ville.findUnique({
      where: {
        // Nous recherchons la ville par une combinaison de nom et code postal
        nom_codePostal: {
          nom: validatedData.city,
          codePostal: validatedData.postalCode,
        },
      },
    });

    if (!ville) {
      ville = await prisma.ville.create({
        data: {
          nom: validatedData.city,
          codePostal: validatedData.postalCode,
        },
      });
    }

    const existingVeterinary = await prisma.veterinaire.findUnique({
      where: { nom: validatedData.clinicName },
    });

    if (existingVeterinary !== null) {
      return NextResponse.json(
        { message: "Le vétérinaire existe déjà" },
        { status: 400 }
      );
    }

    const veterinary = await prisma.veterinaire.create({
      data: {
        nom: validatedData.clinicName,
        adresse: validatedData.streetName,
        telephone: validatedData.phone,
        horaires: validatedData.openingHours,
        website: validatedData.website,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        villeId: ville.id,
        isOpen24Hours: validatedData.isOpen24Hours,
      },
    });

    const veterinaryWithCity = {
      ...veterinary,
      ville: {
        id: ville.id,
        nom: ville.nom,
        codePostal: ville.codePostal,
      },
    };

    return NextResponse.json(veterinaryWithCity, { status: 200 });
  } catch (error: any) {
    console.error(error);

    if (error instanceof ZodError) {
      // Retourner les erreurs de validation sous forme de réponse JSON
      NextResponse.json(
        {
          message: "Erreur de validation",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: { error },
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
