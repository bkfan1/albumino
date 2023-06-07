import { getAccountAlbums } from "@/middlewares/account";
import { createAlbum } from "@/middlewares/album";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

// Disable bodyParser to allow Multer to handle files on incoming requests
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      {
        try {
          const session = await getServerSession(req, res, authOptions);
          const albums = await getAccountAlbums(session.user.accountId);
          return res.status(200).json({ albums });
        } catch (error) {
          return res.status(500).json({});
        }
      }

      break;

    case "POST":
      return await createAlbum(req, res);

    default:
      return await res.status(405).json({});
      break;
  }
}
