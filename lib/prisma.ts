import { PrismaClient } from "@prisma/client";
import { env } from "@lib/env"; // Assurez-vous que le chemin est correct

const prismaClientSingleton = () => {
  return new PrismaClient(
  //   datasources: {
  //     db: {
  //       url: env.DATABASE_URL, // Utilisez l'URL de la base de données depuis env
  //     },
  //   }, }
   );
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
