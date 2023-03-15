import { getJwt } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        signature: {},
      },
      async authorize(credentials) {
        console.log(credentials);
        if (!credentials?.signature) {
          throw new Error("User not connected");
        }
        try {
          const { signature } = credentials;
          const jwt = await getJwt(signature);
          if (jwt) {
            return jwt;
          }
          return null;
        } catch (error: any) {
          throw new Error("User not connected");
        }
      },
    }),
  ];

  return NextAuth(req, res, {
    providers,
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.idToken = user;
        }
        return token;
      },
      async session({ session, token }) {
        session.user = token.idToken;
        return session;
      },
    },
  });
}
