import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

import multer from "multer";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/utils/firebase-app";
import connection from "@/database/connection";
import Account from "@/database/models/account";
import { v4 } from "uuid";
import Photo from "@/database/models/photo";
import photoSchema from "@/utils/joi_schemas/photo";

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false, // Desactivar el bodyParser de Next.js para que Multer pueda manejar el cuerpo de la petición
  },
};


export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  switch (req.method) {
    case "POST":
      
      if (session) {
        try {
          upload.single("file")(req, res, async (error) => {
            if (error) {
              return await res.status(500)
              .json({ error: "error while attempting to upload file" });
            }

            const { buffer, mimetype } = req.file;
            const filename = v4();
            const db = await connection();
            const account = await Account.findOne({
              email: session.user.email,
            });
            const storageRef = ref(storage, `users/${account._id}/${filename}`);
            const snapshot = await uploadBytes(storageRef, buffer, {
              contentType: mimetype,
            });

            const photoURL = await getDownloadURL(snapshot.ref);
            await Photo.create({
              author_account_id: account._id,

              filename: filename,

              url: photoURL,

              uploaded_at: new Date(),
            });

            await db.disconnect();

            return await res.status(200).json({ url: photoURL });
          });
        } catch (error) {
          return await res.status(500).json({ error: "error" });
        }
      } else {
        return await res.status(401).json({ error: "Unauthorized" });
      }

      break;
   

    default:
      return await res.status(405).json({ error: "Method not allowed" });
      break;
  }
}
