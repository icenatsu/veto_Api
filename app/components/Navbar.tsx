"use client";
import { ThemeToggle } from "@/components/ui/theme/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import AuthButton from "./auth/AuthButton";

const Navbar = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav
      className={`flex h-20 items-center justify-between bg-black/30 px-2 shadow-sm ${
        isHome ? "fixed left-0 top-0 z-10 w-full" : ""
      }`}
    >
      <div className="flex items-center">
        <Avatar className="size-14 md:size-20">
          <AvatarImage src="logo.webp" />
          <AvatarFallback>TTV</AvatarFallback>
        </Avatar>
        <p className="text-xl font-bold text-white">Veto App</p>
      </div>
      <div className="flex items-center gap-2">
        <AuthButton />
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;

