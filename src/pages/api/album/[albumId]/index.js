import { deleteAlbum } from "@/middlewares/album";

export default async function handler(req, res) {

  switch (req.method) {
    case "DELETE":
      return await deleteAlbum(req, res);
      break;

    default:
      return res.status(405).json();
      break;
  }
}
