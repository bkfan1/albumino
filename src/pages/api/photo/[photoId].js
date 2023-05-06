import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import photoSchema from "@/utils/joi_schemas/photo";
import connection from "@/database/connection";
import Photo from "@/database/models/photo";
import { storage } from "@/utils/firebase-app";
import { deleteObject, ref } from "firebase/storage";
import Account from "@/database/models/account";
import Album from "@/database/models/album";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  switch (req.method) {
    case "PUT":
      try {
        const db = await connection();

        const updatedFields = { albums: req.body.albums };
        const updatedPhoto = await Photo.findByIdAndUpdate(
          { _id: req.query.photoId },
          updatedFields,
          { new: true }
        );
        await db.disconnect();
        return await res.status(200).json({});
      } catch (error) {
        console.log(error);
        return await res.status(500).json({});
      }

      break;

    case "DELETE":
      try {
        const db = await connection();
        const deletedPhoto = await Photo.findByIdAndDelete(req.query.photoId);

        const { filename, author_account_id } = deletedPhoto;
        const storageRef = ref(
          storage,
          `users/${author_account_id}/${filename}`
        );
        await deleteObject(storageRef);

        await db.disconnect();
        return res.status(200).json({});
      } catch (error) {
        return res.status(500).json({});
      }

      break;

    default:
      return await res.status(405).json({});
      break;
  }
}
