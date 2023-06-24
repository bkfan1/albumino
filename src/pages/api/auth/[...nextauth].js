import connection from "@/database/connection";
import Account from "@/database/models/Account";
import { compare } from "bcrypt";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    Credentials({
      async authorize(credentials, req) {
        try {
          const db = await connection();
          const account = await Account.findOne({ email: credentials.email });

          if (!account) {
            return null;
          }

          const match = await compare(credentials.password, account.password);

          if (!match) {
            return null;
          }

          return {
            accountId: account._id.toString(),
            email: account.email,
            name: `${account.firstname} ${account.lastname}`,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, user, token }) {
      session.user.accountId = token.accountId;
      return session;
    },
  },

  pages: {
    signIn: "/signin",
    signOut: "/",
    error: "/500",
  },
};

export default NextAuth(authOptions);
