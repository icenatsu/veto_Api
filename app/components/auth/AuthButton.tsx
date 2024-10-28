'use client'
import LoginButton from "./LoginButton";
import LoggedInButton from "./LoggedInButton";
import { useSession } from "next-auth/react";

const AuthButton = () => {
  const session = useSession();  

  const user = session?.data?.user;

  if (!user) {
    return <LoginButton />;
  }

  return <LoggedInButton user={user} />
};

export default AuthButton;
