import { deletePhoto } from "@/middlewares/photo";

export default async function handler(req, res) {
  switch (req.method) {
    case "DELETE":
      return await deletePhoto(req, res);

      break;

    default:
      return await res.status(405).json({ message: "" });
      break;
  }
}
