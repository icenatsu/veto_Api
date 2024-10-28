import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import authConfig from "./authConfig";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    signIn: async({ user, account, profile }) => {
      return true; // Renvoie true pour permettre la connexion
    },
    jwt: async ({ token, user }) => {

      // console.log('SignIn JWT:', { user, token});
      
        if (user) {
          token.id = user.id;
          token.role = user.role;
        }
        return token;
    },
    session: async ({ session, token }) => {

      // console.log('Session Callback:', { session, token });

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role as 'ADMIN' | 'MODERATOR' | 'USER'
        },
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,

  // debug: process.env.NODE_ENV === "development",
});
