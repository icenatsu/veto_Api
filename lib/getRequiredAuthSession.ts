import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { auth } from "@lib/auth";

type ParametersGetServerSession =
  | []
  | [GetServerSidePropsContext]
  | [NextApiRequest, NextApiResponse]

export async function getAuthSession(
  ...parameters: ParametersGetServerSession
) {
  let session;

  if (parameters.length === 0) {
    session = await auth();

  } else if (parameters.length === 1 && Array.isArray(parameters[0])) {
    const ctx = parameters[0][0] as GetServerSidePropsContext;
    session = await auth(ctx);

  } else if (parameters.length === 2) {
    const [req, res] = parameters as [NextApiRequest, NextApiResponse];
    session = await auth(req, res);
    
  } else {
    throw new Error("Paramètres invalides pour getAuthSession");
  }
  
  return session;
}

export async function getRequiredAuthSession(
  ...parameters: ParametersGetServerSession
) {
  const session = await getAuthSession(...parameters);

  if (!session?.user?.id) {
    throw new Error(`Vous devez être authentifié pour accéder à cette page`);
  }

  return session as {
    user: {
      id: string;
      email?: string;
      image?: string;
      name?: string;
      role?: "ADMIN" | "MODERATOR" | "USER"
    };
  };
}
