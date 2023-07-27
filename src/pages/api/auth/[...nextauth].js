import connection from "@/database/connection";
import Account from "@/database/models/Account";
import { findAccountByEmail } from "@/middlewares/account";
import { compare } from "bcrypt";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    Credentials({
      async authorize(credentials, req) {
        try {
          const found = await findAccountByEmail(credentials.email);

          if (!found) {
            throw Error("Accout not found");
          }

          const db = await connection();

          const account = await Account.findOne({ email: credentials.email });

          const match = await compare(credentials.password, account.password);

          if (!match) {
            throw Error("Passwords don't match");
          }

          const user = {
            accountId: account._id.toString(),
            email: account.email,
            name: `${account.firstname} ${account.lastname}`,
          };

          return user;
          
        } catch (error) {
          console.log(error);
          throw Error("An error ocurred while trying to sign in");
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
