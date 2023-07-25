import { createAlbumInvitation } from "@/middlewares/invitation";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return await createAlbumInvitation(req, res);

      break;

    default:
      return res.status(405).json({ message: "" });
      break;
  }
}
