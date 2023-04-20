import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import Album from "@/database/models/album";
import Account from "@/database/models/account";
import connection from "@/database/connection";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  switch (req.method) {
    case "GET":
      try {
        const db = await connection();
        const { _id } = await Account.findOne({ email: session.user.email });
        const albums = await Album.find({ author_account_id: _id });

        return await res.status(200).json({ albums });
      } catch (error) {
        return await res.status(500).json({});
      }

      break;

    default:
        return await res.status(405).json({})
      break;
  }
}
