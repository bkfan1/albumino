import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import Photo from "@/database/models/photo";
import connection from "@/database/connection";
import multer, { memoryStorage } from "multer";
import { storage } from "@/utils/firebase-app";
import Account from "@/database/models/account";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { uploadPhotos } from "@/middlewares/photo";

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
