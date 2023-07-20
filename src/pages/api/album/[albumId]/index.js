import { deleteAlbum, updateAlbumName } from "@/middlewares/album";

export default async function handler(req, res) {
  switch (req.method) {
    case "PUT":
      return await updateAlbumName(req, res);

    case "DELETE":
      return await deleteAlbum(req, res);
      break;

    default:
      return res.status(405).json({ message: "" });
      break;
  }
}
