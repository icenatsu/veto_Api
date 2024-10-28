"use client";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "@components/Loader";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { env } from "@lib/env";

const LogOutButton = () => {
  const signOutMutation = useMutation({
    mutationFn: async () => await signOut({
      callbackUrl: `${env.NEXT_PUBLIC_API_URL}`,
    }),
  });

  return (
    <Button
      variant="destructive"
      disabled={signOutMutation.isPending}
      onClick={() => {
        signOutMutation.mutate();
      }}
    >
      {signOutMutation.isPending ? (
        <Loader className="mr-2" size={12} />
      ) : (
        <LogOut className="mr-2" size={12} />
      )}
      Logout
    </Button>
  );
};

export default LogOutButton;
