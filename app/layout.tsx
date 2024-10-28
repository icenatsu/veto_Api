import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import Navbar from "./components/Navbar";
import { PropsWithChildren } from "react";
import { Session } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Api Véto",
  description: "L'api qui recense les vétos",
};

type LayoutProps = {
  session: Session;
} & PropsWithChildren;

const RootLayout = ({ children, session }: LayoutProps) => {
  return (
    <html lang="fr">
      <body>
        <Providers session={session}>
          <header>
            <Navbar/>
          </header>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
