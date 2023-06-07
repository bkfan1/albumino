import { uploadPhotos } from "@/middlewares/photo";

// Disable bodyParser to allow Multer to handle files on incoming requests
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return await uploadPhotos(req, res);

      break;

    default:
      return res.status(405).json({});
      break;
  }
}
