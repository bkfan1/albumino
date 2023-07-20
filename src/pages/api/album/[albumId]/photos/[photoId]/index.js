import { removePhotoFromAlbum } from "@/middlewares/photo";

export default async function handler(req, res) {
  switch (req.method) {
    case "DELETE":
      return await removePhotoFromAlbum(req, res);

      break;

    default:
      return res.status(405).json({ message: "" });
      break;
  }
}
