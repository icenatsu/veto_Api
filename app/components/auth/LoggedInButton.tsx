"use client";
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import LogOutButton from "@components/auth/LogOutButton";

type LoggedInButton = {
  user: Session["user"];
};

const LoggedInButton = ({ user }: LoggedInButton) => {

  return (
    <div>
      <DropdownMenu>
        <AlertDialog>
          <DropdownMenuTrigger asChild>
            {user.image && (
              <Avatar className="mr-2 size-7 cursor-pointer">
                <AvatarImage src={user.image} alt="photo de profil" />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>Déconnexion</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Etes vous sûre de vouloir vous déconnecter?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Vous allez être déconnecté, voulez vous continuer?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <LogOutButton/>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenu>
    </div>
  );
};

export default LoggedInButton;
