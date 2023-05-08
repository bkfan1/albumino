import connection from "@/database/connection";
import Album from "@/database/models/album";
import Photo from "@/database/models/photo";
import { accountExists } from "../account";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/utils/firebase-app";
import { v4 } from "uuid";
import multer from "multer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const albumExists = async (albumId) => {
  try {
    const db = await connection();
    const foundAlbum = await Album.findById({ _id: albumId });

    if (!foundAlbum) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const isAlbumOwner = async (albumId, accountId) => {
  try {
    const db = await connection();
    const exists = await albumExists(albumId);
    if (!exists) {
      return false;
    }

    const album = await Album.findById({ _id: albumId });

    return album.author_account_id.toString() === accountId;
  } catch (error) {
    return false;
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const db = await connection();

    const updatedPhotos = await Photo.updateMany(
      {
        albums: req.query.albumId,
      },
      { $pull: { albums: req.query.albumId } }
    );

    const deletedAlbum = await Album.findByIdAndDelete({
      _id: req.query.albumId,
    });

    return res.status(200).json({});
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const createAlbum = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const upload = multer({ storage: multer.memoryStorage() });
    upload.array("files")(req, res, async (error) => {
      if (error) {
        return res.status(500).json({});
      }

      const db = await connection();
      const exists = await accountExists(session.user.accountId);

      if (!exists) {
        return res.status(404).json({});
      }

      const createdAlbum = await Album.create({
        author_account_id: session.user.accountId,
        contributors: [],

        name: req.body.name,

        created_at: new Date(),
        updated_at: new Date(),
      });

      for (const file of req.files) {
        const filename = v4();

        const storageRef = ref(storage, `users/${account._id}/${filename}`);

        const metadata = {
          contentType: file.mimetype,
        };

        const snapshot = await uploadBytes(storageRef, file.buffer, metadata);

        const photoURL = await getDownloadURL(snapshot.ref);

        const uploadedPhoto = await Photo.create({
          author_account_id: account._id,
          albums: [createdAlbum._id],

          filename,

          url: photoURL,

          uploaded_at: new Date(),
        });
      }
    });
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({});
  }
};
