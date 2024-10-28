import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [GitHubProvider, GoogleProvider],
} satisfies NextAuthConfig;
