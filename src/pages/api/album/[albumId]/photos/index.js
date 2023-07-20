import { sendAlbumPhotos } from "@/middlewares/album";
import { addExistentPhotoToAlbum } from "@/middlewares/photo";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await sendAlbumPhotos(req, res);
      break;

    case "POST":
      return await addExistentPhotoToAlbum(req, res);

      break;

    default:
      return res.status(405).json({ message: "" });
      break;
  }
}
