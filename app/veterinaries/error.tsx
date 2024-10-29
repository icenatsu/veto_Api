"use client";

import ErrorCard from "@components/ErrorCard";
import { Loader } from "@components/Loader";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { CustomError } from "./types/customError";

type ErrorProps = {
  error: CustomError;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  console.log("message: ", error.message);

  useEffect(() => {
    console.log(error.message);
  }, [error]);

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loader />;
  }

  let title = "";
  let message = "";
  let authRequired = false;

  if (!session) {
    title = "Authentification requise";
    message =
      "Vous devez vous authentifier pour accéder à la liste des vétérinaires.";
    authRequired = true;
  } else if (typeof error === "string") {
    title = "Une erreur est survenue...";
    message = error;
    authRequired = false;
  } else {
    title = "Une erreur est survenue...";
    message = "erreur inconnue";
    authRequired = false;
  }

  return (
    <div className="-mt-32 flex h-screen items-center justify-center">
      <ErrorCard
        title={title}
        message={message}
        authRequired={authRequired}
        reset={reset}
      />
    </div>
  );
}
