import connection from "@/database/connection";
import Account from "@/database/models/Account";
import { compare } from "bcrypt";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

export const findAccountByEmail = async (email) => {
  try {
    const db = await connection();

    const account = await Account.findOne({ email });
    const found = account ? true : false;

    return found;
  } catch (error) {
    throw Error("An error occurred while searching account");
  }
};

export const authOptions = {
  providers: [
    Credentials({
      async authorize(credentials, req) {
        try {
          const found = await findAccountByEmail(credentials.email);

          if (!found) {
            return null;
          }
          const db = await connection();

          const account = await Account.findOne({ email: credentials.email });

          const match = await compare(credentials.password, account.password);

          if (!match) {
            return null;
          }

          const user = {
            accountId: account._id.toString(),
            email: account.email,
            name: `${account.firstname} ${account.lastname}`,
          };

          return user;
        } catch (error) {
          console.log(error);
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
