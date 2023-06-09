import connection from "@/database/connection";
import Photo from "@/database/models/Photo";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { deleteFile, uploadFile } from "@/utils/firebase-app";
import { getDownloadURL } from "firebase/storage";
import { getServerSession } from "next-auth";
import { accountExists } from "../account";
import multer from "multer";
import { v4 } from "uuid";
import {
  albumExists,
  canUploadToAlbum,
  isAlbumContributor,
  isAlbumOwner,
} from "../album";

export const photoExists = async (photoId) => {
  try {
    const db = await connection();
    const photo = await Photo.findById({ _id: photoId });

    if (!photo) {
      return false;
    }
    return true;
  } catch (error) {
    throw Error("An error occurred while attempting to find the photo.");
  }
};

export const isPhotoOwner = async (photoId, accountId) => {
  try {
    const db = await connection();
    const exists = await photoExists(photoId);
    if (!exists) {
      return false;
    }

    const photo = await Photo.findById({ _id: photoId });

    return photo.author_account_id.toString() === accountId;
  } catch (error) {
    throw Error("An error occurred while checking photo ownership.");
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    const exists = await photoExists(req.query.photoId);

    if(!exists){return res.status(404).json({message:"Photo not found"})}

    const isOwner = await isPhotoOwner(
      req.query.photoId,
      session.user.accountId
    );
    if (!isOwner) {
      return res.status(401).json({message:"Unauthorized"});
    }

    const db = await connection();
    const deletedPhoto = await Photo.findByIdAndDelete(req.query.photoId);

    const { filename, author_account_id } = deletedPhoto;
    const url = `users/${author_account_id}/${filename}`;

    // Delete photo file from storage
    const result = await deleteFile(url);

    await db.disconnect();

    return res.status(200).json({message:"Photo deleted successfully"});
  } catch (error) {
    return res.status(500).json({message:"An error occurred while attempting to delete photo"});
  }
};

export const updatePhotoAlbums = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    const exists = await photoExists(req.query.photoId);
    if (!exists) {
      return res.status(404).json({ message: "Photo not found" });
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

    return res.status(200).json({ message: "Photo updated successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "An error ocurred while attempting to update the photo",
    });
  }
};

export const uploadPhotos = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const upload = multer({ storage: multer.memoryStorage() });

    upload.array("files")(req, res, async (error) => {
      if (error) {
        return res.status(500).json({
          message: "An error occurred while attempting to upload photos",
        });
      }

      const albumId = req.body.albumId;
      if (albumId && !(await canUploadToAlbum(session.user.accountId, albumId))) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const uploadedPhotos = await Promise.all(
        req.files.map(async (file) => {
          const filename = v4();
          const fileURL = `users/${session.user.accountId}/${filename}`;

          const metadata = {
            contentType: file.mimetype,
          };

          const snapshot = await uploadFile(fileURL, file.buffer, metadata);
          const photoURL = await getDownloadURL(snapshot.ref);

          return {
            author_account_id: session.user.accountId,
            albums: albumId ? [albumId] : [],
            filename,
            url: photoURL,
            uploaded_at: new Date(),
          };
        })
      );

      await Photo.create(uploadedPhotos);

      return res.status(200).json({ photos: uploadedPhotos });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while attempting to upload photos" });
  }
};
