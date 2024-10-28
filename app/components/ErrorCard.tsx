// ErrorCard.tsx
import LoginButton from "./auth/LoginButton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ErrorCardProps = {
  title?: string;
  message: string;
  authRequired?: boolean;
  reset: () => void;
};

const ErrorCard = ({ title, message, authRequired, reset }: ErrorCardProps) => {
  return (
    <Card className="flex max-w-lg flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{message}</CardDescription>
      </CardContent>
      <CardFooter className="self-end">
        {authRequired && <LoginButton />}
        {!authRequired && (
          <Button variant={"secondary"} onClick={reset}>
            Réessayer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ErrorCard;
