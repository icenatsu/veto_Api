"use client";

import { Veterinary } from "@/utils/schema";
import { Loader } from "@components/Loader";
import VeterinaryForm from "@components/VeterinaryForm";
import { env } from "@lib/env";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const EditPage = ({
  params,
}: {
  params: {
    veterinaryId: string;
  };
}) => {
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
      throw new Error(
        "Erreur lors de la récupération de la clinique vétérinaire"
      );
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
    return <Loader />;
  }
  if (!session) {
    throw new Error();
  }

  if (isFetching) return <Loader />;
  if (!veterinary || error)
    return <div className="text-center">Erreur : {error?.message}</div>;

  return (
    <div className="mt-4 flex justify-center">
      <VeterinaryForm defaultValues={veterinary} />
    </div>
  );
};

export default EditPage;
