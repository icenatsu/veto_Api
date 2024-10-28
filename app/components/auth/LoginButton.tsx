"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "@components/Loader";
import { LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { env } from "@lib/env";
import { usePathname } from "next/navigation";


const LoginButton = () => {
  const pathname = usePathname();
  
  // Mutation for GitHub sign-in
  const signInGitHubMutation = useMutation({
    mutationFn: async () =>
      await signIn("github", {
        callbackUrl: `${env.NEXT_PUBLIC_API_URL}${pathname}`, // La redirection est gérée ici
      }),
  });

  // Mutation for Google sign-in
  const signInGoogleMutation = useMutation({
    mutationFn: async () =>
      await signIn("google", {
        callbackUrl: `${env.NEXT_PUBLIC_API_URL}${pathname}`,
      }),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {signInGoogleMutation.isPending || signInGitHubMutation.isPending ? (
            <Loader className="mr-2" size={12} />
          ) : (
            <LogIn className="mr-2" size={12} />
          )}
          Login
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => signInGitHubMutation.mutate()}>
          <span className="pr-2">
            <FaGithub />
          </span>
          Gihub
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signInGoogleMutation.mutate()}>
          <span className="pr-2">
            <FcGoogle />
          </span>
          Google
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LoginButton;
