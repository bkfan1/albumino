import { updateAlbumInvitation } from "@/middlewares/invitation";

export default async function handler(req, res) {
  switch (req.method) {
    case "PUT":
      return await updateAlbumInvitation(req, res);
      break;

    default:
      return res.status(405).json({ message: "" });
      break;
  }
}
