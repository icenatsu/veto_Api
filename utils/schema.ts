import { z } from "zod";

// Schéma Zod pour le modèle Ville
export const VilleSchema = z.object({
  id: z.number().int().optional(),
  nom: z.string().max(100),
  codePostal: z.string().max(20),
});

// Schéma Zod pour le modèle Veterinaire
export const VeterinarySchema = z.object({
  id: z.number().int().optional(),
  nom: z.string().max(255),
  adresse: z.string().max(255),
  telephone: z
    .string()
    .min(10, {
      message: "Le numéro de téléphone doit comporter au moins 10 chiffres",
    })
    .max(15, {
      message: "Le numéro de téléphone doit comporter au plus 15 chiffres",
    })
    .regex(/^[\d\s+]+$/, {
      message:
        "Le numéro de téléphone ne doit contenir que des chiffres, des espaces, et éventuellement un '+' au début.",
    })
    .transform((val) => val.replace(/\s+/g, "")), // Supprimer les espaces

  horaires: z.string().max(255),
  latitude: z.string().regex(/^-?\d+(\.\d+)?$/, {
    message:
      "La latitude ne doit contenir que des chiffres et un point décimal.",
  }),
  longitude: z.string().regex(/^-?\d+(\.\d+)?$/, {
    message:
      "La longitude ne doit contenir que des chiffres et un point décimal.",
  }),
  website: z.string().max(255).optional().nullable(),
  villeId: z.number().optional(),
  ville: VilleSchema,
  isOpen24Hours: z.boolean(),
});

// Define the form schema
export const VeterinaryFormSchema = z.object({
  clinicName: z
    .string()
    .min(2, {
      message: "Le nom de la clinique doit comporter au moins 2 caractères.",
    })
    .max(255),
  phone: z
    .string()
    .min(10, {
      message: "Le numéro de téléphone doit comporter au moins 10 chiffres",
    })
    .max(15, {
      message: "Le numéro de téléphone doit comporter au plus 15 chiffres",
    })
    .regex(/^[\d\s+]+$/, {
      message:
        "Le numéro de téléphone ne doit contenir que des chiffres, des espaces, et éventuellement un '+' au début.",
    }),
  streetName: z
    .string()
    .min(2, {
      message: "Le nom de la rue doit comporter au moins 2 caractères",
    })
    .max(255),
  postalCode: z
    .string()
    .min(2, {
      message: "Le code postal doit comporter au moins 2 caractères",
    })
    .max(5),
  city: z.string().min(2, {
    message: "Le nom de la ville doit comporter au moins 2 caractères",
  }),
  openingHours: z
    .string()
    .min(2, {
      message: "Les horaires doivent comporter au moins 2 caractères",
    })
    .max(255),
  website: z.string().max(255).optional(),
  latitude: z
    .string()
    .min(2, {
      message: "La latitude doit comporter au moins 2 chiffres",
    })
    .regex(/^-?\d+(\.\d+)?$/, {
      message:
        "La latitude ne doit contenir que des chiffres et un point décimal.",
    }),
  longitude: z
    .string()
    .min(2, {
      message: "La longitude doit comporter au moins 2 chiffres",
    })
    .regex(/^-?\d+(\.\d+)?$/, {
      message:
        "La longitude ne doit contenir que des chiffres et un point décimal.",
    }),
  isOpen24Hours: z.boolean(),
});

export const VeterinariesSchema = z.array(VeterinarySchema);

export type VeterinaryFormSchema = z.infer<typeof VeterinaryFormSchema>;
export type Veterinaries = z.infer<typeof VeterinariesSchema>;
export type Veterinary = z.infer<typeof VeterinarySchema>;
