import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import Photo from "@/database/models/photo";
import connection from "@/database/connection";
import multer, { memoryStorage } from "multer";
import { storage } from "@/utils/firebase-app";
import Account from "@/database/models/account";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  switch (req.method) {
    case "POST":
      const upload = multer({ storage: multer.memoryStorage() });

      upload.array("files")(req, res, async (error) => {
        if (error) {
          return res.status(500).json({});
        }

        const account = await Account.findById(session.user.accountId);

        for (const file of req.files) {
          const filename = v4();

          const storageRef = ref(storage, `users/${account._id}/${filename}`);

          const metadata = {
            contentType: file.mimetype,
          };

          const snapshot = await uploadBytes(storageRef, file.buffer, metadata);

          const photoURL = await getDownloadURL(snapshot.ref);

          const db = await connection();

          const uploadedPhoto = await Photo.create({
            author_account_id: account._id,
            albums: [],

            filename,

            url: photoURL,

            uploaded_at: new Date(),
          });
        }

        return res.status(200).json({});
      });

      break;

    default:
      return res.status(405).json({});
      break;
  }
}
