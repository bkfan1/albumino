import { deletePhoto, updatePhotoAlbums } from "@/middlewares/photo";

export default async function handler(req, res) {

  switch (req.method) {
    case "PUT":
      return await updatePhotoAlbums(req, res);
      break;

    case "DELETE":
      return await deletePhoto(req, res);

      break;

    default:
      return await res.status(405).json({});
      break;
  }
}
