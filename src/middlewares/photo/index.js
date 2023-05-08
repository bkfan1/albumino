import connection from "@/database/connection";
import Photo from "@/database/models/photo";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { deleteFile, uploadFile } from "@/utils/firebase-app";
import { getDownloadURL } from "firebase/storage";
import { getServerSession } from "next-auth";
import { accountExists } from "../account";
import multer from "multer";
import { v4 } from "uuid";

export const photoExists = async (photoId) => {
  try {
    const db = await connection();
    const photo = await Photo.findById({ _id: photoId });

    if (!photo) {
      return false;
    }
    return true;
  } catch (error) {}
};

export const isPhotoOwner = async (photoId, accountId) => {
  try {
    const db = await connection();
    const exists = await photoExists(photoId);
    if (!exists) {
      return false;
    }

    const photo = await Photo.findById({ _id: photoId });

    return (photo.author_account_id.toString() === accountId);
  } catch (error) {
    return false;
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    const isOwner = await isPhotoOwner(
      req.query.photoId,
      session.user.accountId
    );
    if (!isOwner) {
      return res.status(401).json({});
    }

    const db = await connection();
    const deletedPhoto = await Photo.findByIdAndDelete(req.query.photoId);

    const { filename, author_account_id } = deletedPhoto;
    const url = `users/${author_account_id}/${filename}`;
    const result = await deleteFile(url);

    await db.disconnect();

    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({});
  }
};

export const updatePhotoAlbums = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    const exists = await photoExists(req.query.photoId);
    if (!exists) {
      return res.status(404).json({});
    }

    const isOwner = await isPhotoOwner(
      req.query.photoId,
      session.user.accountId
    );

    if (!isOwner) {
      return res.status(401).json({});
    }

    const updatedPhoto = await Photo.findByIdAndUpdate(
      { _id: req.query.photoId },
      { albums: req.body.albums }
    );

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({});
  }
};

export const uploadPhotos = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const upload = multer({ storage: multer.memoryStorage() });

    upload.array("files")(req, res, async (error) => {
      if (error) {
        return res.status(500).json({});
      }

      const exists = await accountExists(session.user.accountId);

      if (!exists) {
        return res.status(404).json({});
      }

      const db = await connection();
      for (const file of req.files) {
        const filename = v4();
        const fileURL = `users/${session.user.accountId}/${filename}`

        const metadata = {
          contentType: file.mimetype,
        };

        const snapshot = await uploadFile(fileURL, file.buffer, metadata)

        const photoURL = await getDownloadURL(snapshot.ref);

        const uploadedPhoto = await Photo.create({
          author_account_id: session.user.accountId,
          albums: [],

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
