import { getAccountAlbums } from "@/middlewares/account";
import { createAlbum } from "@/middlewares/album";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getAccountAlbums(req, res);
      break;

    case "POST":
      return await createAlbum(req, res);

    default:
      return await res.status(405).json({});
      break;
  }
}
