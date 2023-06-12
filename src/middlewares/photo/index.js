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
import Album from "@/database/models/Album";
import { allowedPhotosFileTypes, hasInvalidFileType } from "@/utils/validation";

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

export const isPhotoInAlbum = async(photoId, albumId)=>{
  try {
    let existsPhoto = await photoExists(photoId);

    if(!existsPhoto){throw Error("Photo not found")}

    const existsAlbum = await albumExists(albumId);

    if(!existsAlbum){throw Error("Album not found")}

    const db = await connection();

    const foundPhoto = await Photo.findById(photoId);

    const isInAlbum = foundPhoto.albums.some((photoAlbumId)=> photoAlbumId.toString() === albumId);

    return isInAlbum;

    
  } catch (error) {
    throw Error("Error while checking if photo in album")
  }

}

export const isPhotoOwner = async (photoId, accountId) => {
  try {
    const db = await connection();
    const exists = await photoExists(photoId);
    if (!exists) {
      throw Error("Photo not found.");
    }

    const photo = await Photo.findById({ _id: photoId });

    const isOwner = photo.author_account_id.toString() === accountId;

    return isOwner;
  } catch (error) {
    throw Error("An error occurred while checking photo ownership.");
  }
};

export const deletePhoto = async (req, res) => {
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
      return res.status(401).json({ message: "Unauthorized" });
    }

    const db = await connection();
    const deletedPhoto = await Photo.findByIdAndDelete(req.query.photoId);

    const { filename, author_account_id } = deletedPhoto;
    const url = `users/${author_account_id}/${filename}`;

    // Delete photo file from storage
    const result = await deleteFile(url);

    // await db.disconnect();

    return res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while attempting to delete photo" });
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

      // If req.files has at least 1 not allowed file type
      if (hasInvalidFiles) {
        // Filter the ones who actually haves allowed file types
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
      else if(!albumId){
        const exists = await accountExists(session.user.accountId)

        if(!exists){return res.status(404).json({message:"Account not found"})}
      }

      let uploadedPhotos = await Promise.all(
        filesToUpload.map(async (file) => {
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

      const db = await connection();
      uploadedPhotos = await Photo.create(uploadedPhotos);

      if (albumId) {
        await Album.findByIdAndUpdate(
          { _id: albumId },
          { updated_at: new Date() }
        );
      }

      return res
        .status(200)
        .json({
          photos: uploadedPhotos.map(
            ({
              _id,
              author_account_id,
              albums,
              filename,
              url,
              uploaded_at,
            }) => ({
              id: _id.toString(),
              author_account_id,
              albums,
              filename,
              url,
              uploaded_at,
            })
          ),
        });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while attempting to upload photos" });
  }
};

export const addExistentPhotoToAlbum = async(req, res)=>{

  try {
    const session = await getServerSession(req, res, authOptions);
    const isInAlbum = await isPhotoInAlbum(req.query.photoId, req.query.albumId);

    if(isInAlbum){
      return res.status(400).json({message:"Photo is already on album"})
    }

    const ownsPhoto = await isPhotoOwner(req.query.photoId, session.user.accountId);

    if(!ownsPhoto){
      return res.status(403).json({message:"You are not the owner of the photo"})
    }

    const canUpload = await canUploadToAlbum(session.user.accountId, req.query.albumId);

    if(!canUpload){
      return res.status(403).json({message:"You are not the owner or a contributor of the photo"})
    }

    const updatedPhoto = await Photo.findByIdAndUpdate({_id: req.query.photoId}, {
      $push:{albums: req.query.albumId}
    });


    return res.status(200).json({photo: updatedPhoto})
    
  } catch (error) {
    return res.status(500).json({message:"An error occurred while attempting to add photo to album"})
    
  }

}

export const removePhotoFromAlbum = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const isInAlbum = await isPhotoInAlbum(req.query.photoId, req.query.albumId);

    if(!isInAlbum){
      return res.status(404).json({message:"Photo not found in album"})
    }

    const ownsAlbum = await isAlbumOwner(
      req.query.albumId,
      session.user.accountId
    );
    const ownsPhoto = await isPhotoOwner(
      req.query.photoId,
      session.user.accountId
    );

    if(!(ownsAlbum || ownsPhoto)){
      return res.status(403).json({message:"You are not the owner or a contributor of the photo"})
    }

    // Removing album ID from the Photo
    const updatedPhoto = await Photo.findByIdAndUpdate(
      { _id: req.query.photoId },
      {
        $pull: { albums: req.query.albumId },
      }
    );

    return res.status(200).json({message:"Photo removed from album successfully"});
  } catch (error) {
    return res.status(500).json({message:"An error occurred while trying to remove Photo from Album."});
  }
};

export const getFirstPhotoInAlbum = async (albumId) => {
  try {
    const photo = await Photo.findOne({ albums: albumId }).sort('created_at').exec();
    return photo;
  } catch (error) {
    console.log(error);
    throw new Error('Error retrieving first photo in album');
  }
};