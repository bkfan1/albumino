import { removeAlbumContributor } from "@/middlewares/album";

export default function handler(req, res) {
  switch (req.method) {
    case "POST":
      break;
    case "DELETE":
      return removeAlbumContributor(req, res);
      break;

    default:
      break;
  }
}
