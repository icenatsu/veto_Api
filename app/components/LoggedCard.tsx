import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "next-auth";

type LoggedCardProps = {
  user: User; // Utiliser le type User de next-auth
};

const LoggedCard = ({ user }: LoggedCardProps) => {
  return (
    <Card className="w-full md:max-w-96">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{user.name}</CardTitle>
        {user.image && (
          <CardTitle>
            <Avatar>
              <AvatarImage src={user.image} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <CardDescription>{user.email}</CardDescription>
        <CardDescription>
          {user.role === "ADMIN" ? "Administrateur" : "Utilisateur"}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default LoggedCard;
