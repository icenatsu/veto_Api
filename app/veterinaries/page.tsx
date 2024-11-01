"use client";

import LoggedCard from "@/app/components/LoggedCard";
import { Button } from "@/components/ui/button";
import Legend from "@components/Legend";
import { Loader } from "@components/Loader";
import Searchbar from "@components/Searchbar";
import VeterinariesList from "@components/VeterinariesList";
import VeterinaryForm from "@components/VeterinaryForm";
import { env } from "@lib/env";
import { useQuery } from "@tanstack/react-query";
import { LatLngBounds } from "leaflet";
import { CirclePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Veterinaries } from "../../utils/schema";

// Charger le composant Map dynamiquement
const Map = dynamic(() => import("@components/Map"), { ssr: false });

type User = {
  name?: string;
  email?: string;
  role: string;
  image: string;
};

const VeterinariesPage = () => {
  const [showNewVeterinaryForm, setShowNewVeterinaryForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [veterinaryId, setVeterinaryId] = useState<number | null>(null);
  const veterinaryFormRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  const [franceBounds, setFranceBounds] = useState<LatLngBounds | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const user = session?.user || null;

  useEffect(() => {
    const { LatLngBounds } = require("leaflet");
    // Initialise les bounds uniquement côté client
    const bounds = new LatLngBounds([41.333, -5.225], [51.124, 9.662]);
    setFranceBounds(bounds);
  }, []);

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

  // otherPoints GPS
  const otherPoints = veterinaries?.map((vet) => ({
    id: vet.id,
    lat: Number(vet.latitude),
    lng: Number(vet.longitude),
    cityName: vet.ville.nom,
    clinicName: vet.nom,
    isOpen24Hours: vet.isOpen24Hours,
  }));

  const handleClickAnchorandCenterFrenchMap = () => {
    if (typeof window !== "undefined" && franceBounds) {
      window.location.hash = "#frenchMap";
      const mapElement = document.getElementById("frenchMap");
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: "smooth" });
      }
      setVeterinaryId(null);
      mapInstance?.fitBounds(franceBounds);
    }
    return;
  };

  const getMapInstance = (map: L.Map) => {
    setMapInstance(map);
  };

  return (
    <section className="flex flex-col gap-5 p-5 lg:gap-10 lg:p-20 xl:flex-col xl:px-40 xl:py-20">
      <div className="flex flex-col gap-5 lg:gap-10">
        {user && <LoggedCard user={user} />}
        <h2 className="mb-4 text-center text-2xl">
          Liste cliniques vétérinaires
        </h2>
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
              getMapInstance={getMapInstance}
            />
          </div>
          <div className="flex w-full items-center justify-between">
            <Legend />
            <Button
              variant={"link"}
              className="text-sm md:text-xl"
              onClick={handleClickAnchorandCenterFrenchMap}
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
