import connection from "@/database/connection";
import Photo from "@/database/models/Photo";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getFolderSize, deleteFile, uploadFile } from "@/utils/firebase-app";
import { getDownloadURL } from "firebase/storage";
import { getServerSession } from "next-auth";
import { accountExists } from "../account";
import multer from "multer";
import { v4 } from "uuid";
import {
  albumExists,
  canUploadToAlbum,
  isAlbumOwner,
  updateAlbumLastModification,
} from "../album";
import { allowedPhotosFileTypes, hasInvalidFileType } from "@/utils/validation";
import { getAvailableSpace } from "../account/storage";

export const photoExists = async (photoId) => {
  try {
    const db = await connection();
    const photo = await Photo.findById(photoId);

    return photo ? true : false;
  } catch (error) {
    throw Error("An error occurred while attempting to find the photo.");
  }
};

export const isPhotoInAlbum = async (photoId, albumId) => {
  try {
    const existsPhoto = await photoExists(photoId);

    if (!existsPhoto) {
      throw Error("Photo not found");
    }

    const existsAlbum = await albumExists(albumId);

    if (!existsAlbum) {
      throw Error("Album not found");
    }

    const db = await connection();

    const foundPhoto = await Photo.findById(photoId);

    const isInAlbum = foundPhoto.albums.some(
      (photoAlbumId) => photoAlbumId.toString() === albumId
    );

    return isInAlbum;
  } catch (error) {
    throw Error("Error while checking if photo in album");
  }
};

export const isPhotoOwner = async (photoId, accountId) => {
  try {
    const db = await connection();
    const existsPhoto = await photoExists(photoId);
    if (!existsPhoto) {
      throw Error("Photo not found");
    }

    const existsAccount = await accountExists(accountId);

    if (!existsAccount) {
      throw Error("Account not found");
    }

    const photo = await Photo.findById(photoId);

    const isOwner = photo.author_account_id.toString() === accountId;

    return isOwner;
  } catch (error) {
    throw Error("An error occurred while checking photo ownership.");
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    const existsPhoto = await photoExists(req.query.photoId);

    if (!existsPhoto) {
      return res.status(404).json({ message: "Photo not found" });
    }

    const isOwner = await isPhotoOwner(
      req.query.photoId,
      session.user.accountId
    );

    if (!isOwner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const db = await connection();
    const deletedPhoto = await Photo.findByIdAndDelete(req.query.photoId);

    const { filename, author_account_id } = deletedPhoto;
    const url = `users/${author_account_id}/${filename}`;

    // Delete photo file from storage
    await deleteFile(url);

    return res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while attempting to delete photo" });
  }
};

export const calculateUploadSize = (files) => {
  try {
    let uploadSize = 0;

    for (const file of files) {
      uploadSize += file.size;
    }

    return uploadSize;
  } catch (error) {
    throw "An error occurred while calculating the upload size";
  }
};

export const uploadPhotoToStorage = async (path, file) => {
  try {
    const newFileName = v4();
    const filePath = `${path}${filename}`;

    const metadata = {
      contentType: file.mimetype,
    };

    const snapshot = await uploadFile(filePath, file.buffer, metadata);
    const photoURL = await getDownloadURL(snapshot.ref);

    return {
      photoFileName: newFileName,
      photoURL,
    };
  } catch (error) {
    throw Error("An error occurred while trying to upload photo to storage");
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

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: "No files found in the request",
        });
      }

      let filesToUpload = [...req.files];

      const hasInvalidFiles = hasInvalidFileType(
        req.files,
        allowedPhotosFileTypes
      );

      // If req.files has at least one file with a not allowed filetype
      if (hasInvalidFiles) {
        // Filter the ones who actually have allowed file types
        const filteredFiles = req.files.filter((file) =>
          allowedPhotosFileTypes.includes(file.mimetype)
        );
        filesToUpload = filteredFiles;
      }

      // If after filtering, the array does not have items, send a 400 status and end the function
      if (filesToUpload.length === 0) {
        return res
          .status(400)
          .json({ message: "No files found in the request" });
      }

      const albumId = req.body.albumId;
      if (
        albumId &&
        !(await canUploadToAlbum(session.user.accountId, albumId))
      ) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      // If there is no albumId, then the user its just trying to upload
      // photos without album association
      else if (!albumId) {
        const exists = await accountExists(session.user.accountId);

        if (!exists) {
          return res.status(404).json({ message: "Account not found" });
        }
      }

      const uploadSize = calculateUploadSize(filesToUpload);
      const availableSpace = await getAvailableSpace(session.user.accountId);

      if (!(uploadSize <= availableSpace)) {
        return res.status(400).json({ message: "Account storage is full" });
      }

      let uploadedPhotos = await Promise.all(
        filesToUpload.map(async (file) => {
          const accountPhotosPath = `users/${session.user.accountId}/`;
          
          const { photoFileName, photoURL } = await uploadPhotoToStorage(
            accountPhotosPath,
            file
          );
          

          return {
            author_account_id: session.user.accountId,
            albums: albumId ? [albumId] : [],

            filename: photoFileName,
            url: photoURL,

            uploaded_at: new Date(),
          };
        })
      );

      const db = await connection();

      uploadedPhotos = await Photo.create(uploadedPhotos);

      // If the uploading files are for an album, update album last modification date
      if (albumId) {
        await updateAlbumLastModification(albumId, new Date());
      }

      const photos = uploadedPhotos.map(
        ({ _id, author_account_id, albums, filename, url, uploaded_at }) => ({
          id: _id.toString(),
          author_account_id,
          albums,
          filename,
          url,
          uploaded_at,
        })
      );

      return res.status(200).json({
        photos,
      });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while attempting to upload photos" });
  }
};

export const addExistentPhotoToAlbum = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const isInAlbum = await isPhotoInAlbum(
      req.query.photoId,
      req.query.albumId
    );

    if (isInAlbum) {
      return res.status(400).json({ message: "Photo is already on album" });
    }

    const ownsPhoto = await isPhotoOwner(
      req.query.photoId,
      session.user.accountId
    );

    if (!ownsPhoto) {
      return res
        .status(403)
        .json({ message: "You are not the owner of the photo" });
    }

    const canUpload = await canUploadToAlbum(
      session.user.accountId,
      req.query.albumId
    );

    if (!canUpload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updatedPhoto = await Photo.findByIdAndUpdate(req.query.photoId, {
      $push: { albums: req.query.albumId },
    });

    await updateAlbumLastModification(req.query.albumId, new Date());

    return res.status(200).json({ photo: updatedPhoto });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while attempting to add photo to album",
    });
  }
};

export const removePhotoFromAlbum = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const isInAlbum = await isPhotoInAlbum(
      req.query.photoId,
      req.query.albumId
    );

    if (!isInAlbum) {
      return res.status(404).json({ message: "Photo not found in album" });
    }

    const ownsAlbum = await isAlbumOwner(
      req.query.albumId,
      session.user.accountId
    );
    const ownsPhoto = await isPhotoOwner(
      req.query.photoId,
      session.user.accountId
    );

    if (!(ownsAlbum || ownsPhoto)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Removing album ID from the Photo
    const updatedPhoto = await Photo.findByIdAndUpdate(req.query.photoId, {
      $pull: { albums: req.query.albumId },
    });

    await updateAlbumLastModification(req.query.albumId, new Date());

    return res
      .status(200)
      .json({ message: "Photo removed from album successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while trying to remove Photo from Album.",
    });
  }
};

export const getFirstPhotoInAlbum = async (albumId) => {
  try {
    const photo = await Photo.findOne({ albums: albumId })
      .sort("created_at")
      .exec();
    return photo;
  } catch (error) {
    console.log(error);
    throw new Error("Error retrieving first photo in album");
  }
};
