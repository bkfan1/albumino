import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import Album from "@/database/models/album";
import Account from "@/database/models/account";
import connection from "@/database/connection";
import albumSchema from "@/utils/joi_schemas/album";
import Photo from "@/database/models/photo";
import multer from "multer";
import album from "@/database/models/album";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/utils/firebase-app";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  switch (req.method) {
    case "GET":
      try {
        const db = await connection();
        const account = await Account.findOne({ _id: session.user.accountId });
        if (account) {
          const { _id } = account;
          const accountAlbums = await Album.find({ author_account_id: _id });

          let albums = [];

          for(const album of accountAlbums){

            const albumPhotos = await Photo.find({albums: album._id});

            albums.push({
              id: album._id.toString(),
              name: album.name,

              photos: albumPhotos.map((album)=>({id: album._id.toString(), url: album.url, uploaded_at: album.uploaded_at})),

              created_at: album.created_at,
              updated_at: album.updated_at
            })

          }

          
          return await res.status(200).json({ albums });
        }

        return await res.status(404).json({});
      } catch (error) {
        return await res.status(500).json({});
      }

      break;

    case "POST":
      const upload = multer({ storage: multer.memoryStorage() });
      upload.array("files")(req, res, async (error) => {
        if (error) {
          return res.status(500).json({});
        }

        const db = await connection();

        const account = await Account.findOne({ _id: session.user.accountId });

        const createdAlbum = await Album.create({
          author_account_id: account._id,
          contributors: [],

          name: req.body.name,

          created_at: new Date(),
          updated_at: new Date(),
        });

        if (req.files.length >= 1) {
          for (const file of req.files) {
            const filename = v4();

            const storageRef = ref(storage, `users/${account._id}/${filename}`);

            const metadata = {
              contentType: file.mimetype,
            };

            const snapshot = await uploadBytes(
              storageRef,
              file.buffer,
              metadata
            );

            const photoURL = await getDownloadURL(snapshot.ref);

            const db = await connection();

            const uploadedPhoto = await Photo.create({
              author_account_id: account._id,
              albums: [createdAlbum._id],

              filename,

              url: photoURL,

              uploaded_at: new Date(),
            });
          }
          return res.status(200).json({})
        }

        return res.status(200).json({})
      });

    default:
      return await res.status(405).json({});
      break;
  }
}
