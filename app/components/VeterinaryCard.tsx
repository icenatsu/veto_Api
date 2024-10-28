"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@lib/env";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Veterinary } from "../../utils/schema";

type VeterinaryCardProps = {
  veterinary: Veterinary;
  getVeterinaryId?: (id: number) => void;
};

const VeterinaryCard = ({
  veterinary,
  getVeterinaryId,
}: VeterinaryCardProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = useSession();

  if (!session) {
    return;
  }

  const fetchVeterinaryDelete = async () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce vétérinaire?")) {
      try {
        const response = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/api/veterinaries/${veterinary.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: veterinary.id }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message) {
            throw new Error(errorData.message);
          }
        }
        queryClient.invalidateQueries({ queryKey: ["veterinaries"] });
        toast.success("Vétérinaire supprimé avec succès");
        router.push("/veterinaries");
      } catch (error: any) {
        toast.error(error.message || "Erreur réseau ou autre");
        throw error;
      }
    }
  };

  const centralPoint = {
    id: veterinary.id,
    lat: Number(veterinary.latitude),
    lng: Number(veterinary.longitude),
    name: veterinary.nom,
  };

  if (!centralPoint) {
    return <div className="text-center">Point non trouvé</div>;
  }

  const handleClickGetVeterinaryId = () => {
    if (getVeterinaryId) {
      getVeterinaryId(veterinary.id as number);
    }

    // Ajouter l'ancre à l'URL
    window.location.hash = "#frenchMap";

    // faire défiler vers l'élément avec l'ID "frenchMap"
    const mapElement = document.getElementById("frenchMap");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Card className="relative w-full xl:max-w-80">
      <CardHeader className="items-centerS flex justify-between">
        <CardTitle className="max-w-xs whitespace-normal break-words">
          {veterinary.nom}
        </CardTitle>
        {veterinary.isOpen24Hours && (
          <CardTitle>
            <Avatar className="absolute right-2 top-2 size-14 md:size-16">
              <AvatarImage src="/logo_24h.webp" />
              <AvatarFallback>24h</AvatarFallback>
            </Avatar>
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <CardDescription className="max-w-xs whitespace-normal break-words">
          {veterinary.adresse}, {veterinary.ville.codePostal}{" "}
          {veterinary.ville.nom}
        </CardDescription>

        <pre className="whitespace-pre-wrap break-words text-sm">
          {veterinary.horaires}
        </pre>
        <CardDescription className="max-w-xs whitespace-normal break-words">
          {veterinary.telephone}
        </CardDescription>
        <CardDescription className="max-w-xs whitespace-normal break-words">
          {veterinary.latitude}
        </CardDescription>
        <CardDescription className="max-w-xs whitespace-normal break-words">
          {veterinary.longitude}
        </CardDescription>
        {veterinary.website && (
          <CardDescription className="max-w-xs whitespace-normal break-words">
            <a
              target="_blank"
              href={veterinary.website}
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {veterinary.website}
            </a>
          </CardDescription>
        )}
      </CardContent>
      <CardFooter className="flex gap-4">
        {pathname === `/veterinaries/${veterinary.id}` &&
        session.data?.user.role !== "USER" ? (
          <Link href={`${veterinary.id}/edit`}>
            <Button>Editer</Button>
          </Link>
        ) : null}
        {pathname === `/veterinaries/${veterinary.id}` &&
        session.data?.user.role !== "USER" ? (
          <Button onClick={fetchVeterinaryDelete}>Effacer</Button>
        ) : null}
        {pathname === `/veterinaries` && (
          <Link href={`/veterinaries/${veterinary.id}`}>
            <Button>Détails</Button>
          </Link>
        )}
        {pathname === `/veterinaries` && (
          <Button onClick={handleClickGetVeterinaryId}>Point GPS</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VeterinaryCard;
