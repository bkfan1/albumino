import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import connection from "@/database/connection";
import albumSchema from "@/utils/joi_schemas/album";
import Album from "@/database/models/album";
import Account from "@/database/models/account";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      const session = await getServerSession(req, res, authOptions);
      if (session) {
        try {
          const result = await albumSchema.validateAsync(req.body);
          const db = await connection();
          const account = await Account.findOne({ email: session.user.email });

          if (account) {
            await Album.create({
              ...req.body,
              author_account_id: account._id,
            });

            return await res.status(200).json({});
          }

          await db.disconnect();

          return await res.status(400).json({});
        } catch (error) {
          console.log(error);
          return await res.status(500).json({});
        }
      } else {
        return await res.status(401).json({});
      }

      break;

    default:
      break;
  }
}
