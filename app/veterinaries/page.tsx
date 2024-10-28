"use client";

import { Button } from "@/components/ui/button";
import Legend from "@components/Legend";
import { Loader } from "@components/Loader";
import Searchbar from "@components/Searchbar";
import VeterinariesList from "@components/VeterinariesList";
import VeterinaryForm from "@components/VeterinaryForm";
import { env } from "@lib/env";
import { useQuery } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Veterinaries } from "../../utils/schema";

// Charger le composant Map dynamiquement
const Map = dynamic(() => import("@components/Map"), { ssr: false });

const VeterinariesPage = () => {
  const [showNewVeterinaryForm, setShowNewVeterinaryForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [veterinaryId, setVeterinaryId] = useState<number | null>(null);
  const veterinaryFormRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (showNewVeterinaryForm && veterinaryFormRef.current) {
      veterinaryFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showNewVeterinaryForm]);

  const fetchVeterinaries = async (): Promise<Veterinaries> => {
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/api/veterinaries`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message) {
          throw new Error(errorData.message);
        }
      }

      return response.json();
    } catch (error: any) {
      toast.error(
        error.message ||
          "Erreur lors de la récupération des cliniques vétérinaires"
      );
      throw new Error(
        "Erreur lors de la récupération des cliniques vétérinaires"
      );
    }
  };

  const {
    data: veterinaries,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["veterinaries"],
    queryFn: fetchVeterinaries,
    staleTime: 4 * 60 * 1000,
  });

  if (status === "loading") {
    return <Loader />;
  }
  if (!session) {
    throw new Error();
  }

  const handleClickShowVeterinaryForm = () => {
    setShowNewVeterinaryForm((prev) => !prev);
  };
  console.log(showNewVeterinaryForm);

  const handleClickGetVeterinaryId = (id: number | null) => {
    setVeterinaryId(id);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredVeterinaries = veterinaries?.filter(
    (vet) =>
      vet.nom.toLowerCase().includes(searchQuery) ||
      vet.ville.nom.toLowerCase().includes(searchQuery) ||
      vet.ville.codePostal.includes(searchQuery)
  );

  const otherPoints = veterinaries?.map((vet) => ({
    id: vet.id,
    lat: Number(vet.latitude),
    lng: Number(vet.longitude),
    cityName: vet.ville.nom,
    clinicName: vet.nom,
    isOpen24Hours: vet.isOpen24Hours,
  }));

  const handleClickAnchorFrenchMap = () => {
    window.location.hash = "#frenchMap";
    const mapElement = document.getElementById("frenchMap");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth" });
    }
    setVeterinaryId(null);
  };

  return (
    <section className="flex flex-col gap-5 p-5 lg:gap-10 lg:p-20 xl:flex-col xl:items-center xl:px-40 xl:py-20">
      <div className="flex flex-col items-center gap-5 lg:gap-10">
        <h2 className="mb-4 text-2xl">Liste cliniques vétérinaires</h2>
        {veterinaries?.length === 0 && (
          <p>
            Aucune clinique vétérinaire n&apos;est inscrite dans la base de
            donnée
          </p>
        )}
        {!isFetching && !error && veterinaries!.length > 0 && (
          <Searchbar onSearch={handleSearch} />
        )}
        {session?.user.role !== "USER" ? (
          <CirclePlus
            onClick={handleClickShowVeterinaryForm}
            className="cursor-pointer"
          />
        ) : null}
      </div>
      {isFetching && <Loader />}
      {error && <div className="text-center">Erreur : {error?.message}</div>}
      {!isFetching && !error && (
        <>
          <div id="frenchMap" style={{ height: "500px", width: "100%" }}>
            <Map
              otherPoints={otherPoints}
              veterinaryId={veterinaryId as number}
            />
          </div>
          <div className="flex w-full items-center justify-between">
            <Legend />
            <Button
              variant={"link"}
              className="text-sm md:text-xl"
              onClick={handleClickAnchorFrenchMap}
            >
              Map France
            </Button>
          </div>
          <VeterinariesList
            veterinaries={filteredVeterinaries || []}
            getVeterinaryId={handleClickGetVeterinaryId}
          />
        </>
      )}
      {showNewVeterinaryForm && (
        <VeterinaryForm
          ref={veterinaryFormRef}
          onClose={handleClickShowVeterinaryForm}
        />
      )}
    </section>
  );
};

export default VeterinariesPage;
