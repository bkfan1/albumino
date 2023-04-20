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
            return { id: account._id ,email: account.email };
          }
          return null;
        }

        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
