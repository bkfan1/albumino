import { removeAlbumContributor } from "@/middlewares/album";

export default function handler(req, res) {
  switch (req.method) {
    case "POST":
      break;
    case "DELETE":
      return removeAlbumContributor(req, res);
      break;

    default:
      return res.status(405).json({ message: "" });
      break;
  }
}
