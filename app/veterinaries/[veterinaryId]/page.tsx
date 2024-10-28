"use client";

import { Veterinary } from "@utils/schema";
import { useQuery } from "@tanstack/react-query";
import VeterinaryCard from "@components/VeterinaryCard";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { env } from "@lib/env";
import { useSession } from "next-auth/react";
import { Loader } from "@components/Loader";
// Charger le composant Map dynamiquement car Leaflet doit être rendu uniquement côté client
const Map = dynamic(() => import("@components/Map"), { ssr: false });

const VeterinaryPage = ({
  params,
}: {
  params: {
    veterinaryId: string;
  };
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const fetchVeterinary = async (veterinaryId: string): Promise<Veterinary> => {
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/api/veterinaries/${veterinaryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache",
        }
      );

      if (!response.ok) {
        // Traitement des erreurs retournées par l'API
        const errorData = await response.json();
        if (errorData.message) {
          throw new Error(errorData.message);
        }
      }

      return response.json();
    } catch (error: any) {
      toast.error(
        error.message ||
          "Erreur lors de la récupération de la clinique vétérinaire"
      );
      throw new Error("Erreur lors de la récupération de la clinique vétérinaire");
    }
  };

  const {
    data: veterinary,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["veterinary", params.veterinaryId],
    queryFn: () => fetchVeterinary(params.veterinaryId),
    enabled: !!params.veterinaryId,
  });


  if (status === "loading") {
    return <Loader/>;
  }

  if (!session) {
    throw new Error()
  }

  if (isFetching) return <Loader/>;
  if (!veterinary || error){
    throw(error?.message)
  }

  const centralPoint = {
    id: veterinary.id,
    lat: Number(veterinary.latitude),
    lng: Number(veterinary.longitude),
    clinicName: veterinary.nom,
    cityName: veterinary.ville.nom,
    isOpen24Hours: veterinary.isOpen24Hours,
  };

  if (!centralPoint) {
    return <div>Point non trouvé</div>;
  }

  const handleClick = () => {
    router.push(`${env.NEXT_PUBLIC_API_URL}/veterinaries`);
  };

  return (
    <div className="flex flex-col gap-5 p-5 lg:p-20 xl:p-40">
      <Button onClick={handleClick}>Retour aux cliniques vétérinaires</Button>
      <div className="flex flex-col gap-5 xl:flex-row xl:justify-center">
        <VeterinaryCard veterinary={veterinary} />
        <div style={{ height: "500px", width: "100%" }}>
          <Map centralPoint={centralPoint} />
        </div>
      </div>
    </div>
  );
};

export default VeterinaryPage;
