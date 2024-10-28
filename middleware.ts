import authConfig from "@lib/authConfig";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)

// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req: NextRequest) {
  // Your custom middleware logic goes here
  try {
    const { nextUrl } = req;
    // Appeler la fonction d'authentification
    const session = await auth();
    const isAuthenticated = !!session?.user;

    // console.log(isAuthenticated);
    
    // console.log("session: ", session);
    // console.log("nextURl: ", nextUrl);
    
    
    // // Continuer la requête ou rediriger en fonction de la session
    // if (session !== null) {
    //   return NextResponse.next(); // Continuer si l'utilisateur est authentifié
    // } else {
    //   return NextResponse.redirect(new URL("/?error=unauthenticated", req.url));
    // }
  } catch (error) {
    console.error('Middleware Error:', error);
    return NextResponse.next(); // Continuer même en cas d'erreur
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
