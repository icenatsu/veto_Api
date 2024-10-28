// next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultUser, DefaultSession, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id?: string;
    role?: 'ADMIN' | 'MODERATOR' | 'USER';
  }

  interface Session {
    user: User;
  }

  interface JWT extends DefaultJWT {
    id?: string;
    role?: 'ADMIN' | 'MODERATOR' | 'USER';
  }
}
