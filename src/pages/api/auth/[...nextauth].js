import connection from "@/database/connection";
import Account from "@/database/models/account";
import { compare } from "bcrypt";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    Credentials({
      async authorize(credentials, req) {
        const db = await connection();
        const account = await Account.findOne({ email: credentials.email });

        if (account) {
          const match = await compare(credentials.password, account.password);
          if (match) {
            return { accountId: account._id.toString() ,email: account.email, name: `${account.firstname} ${account.lastname}`};
          }
          return null;
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({token, user}){
      return {...token, ...user}
    },
    async session({session, user, token}){
      session.user.accountId = token.accountId;
      return session;
    }
  },

  pages: {
    signIn: "/signin"
  }

};

export default NextAuth(authOptions);
