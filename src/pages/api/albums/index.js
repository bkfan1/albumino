import { sendAccountAlbums } from "@/middlewares/account";
import { createAlbum } from "@/middlewares/album";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return sendAccountAlbums(req, res);
      break;

    case "POST":
      return await createAlbum(req, res);
      break;

    default:
      return await res.status(405).json({ message: "" });
      break;
  }
}
