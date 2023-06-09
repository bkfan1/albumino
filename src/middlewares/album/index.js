import connection from "@/database/connection";
import Album from "@/database/models/Album";
import Photo from "@/database/models/Photo";
import { accountExists } from "../account";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/utils/firebase-app";
import { v4 } from "uuid";
import multer from "multer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Account from "@/database/models/Account";

export const albumExists = async (albumId) => {
  try {
    const db = await connection();
    const foundAlbum = await Album.findById({ _id: albumId });

    if (!foundAlbum) {
      return false;
    }
    return true;
  } catch (error) {
    throw Error("An error occurred while attempting to find album.");
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
    throw Error("An error occurred while checking album ownership.");
  }
};

export const isAlbumContributor = async (albumId, accountId) => {
  try {
    const db = await connection();
    const exists = await albumExists(albumId);

    if (!exists) {
      return false;
    }

    const album = await Album.findById({ _id: albumId });

    return album.contributors.includes(accountId);
  } catch (error) {
    throw "An error occurred while checking album contributor.";
  }
};

export const getAlbum = async (albumId) => {
  try {
    const db = await connection();
    const exists = await albumExists(albumId);

    if (!exists) {
      return false;
    }

    const album = await Album.findById({ _id: albumId });

    const albumPhotos = await Photo.find({ albums: albumId });
    const albumContributors = await Account.find({
      _id: { $in: album.contributors },
    });

    const data = {
      id: album._id.toString(),
      name: album.name,

      contributors: albumContributors.map(({ _id, firstname, lastname }) => ({
        id: _id.toString(),
        firstname,
        lastname,
      })),

      photos: albumPhotos.map(({ _id, url, uploaded_at }) => ({
        id: _id.toString(),
        url,
        uploaded_at: uploaded_at.toString(),
      })),

      updated_at: album.updated_at.toString(),
      created_at: album.created_at.toString(),
    };

    return data;
  } catch (error) {
    throw Error("An error ocurred while getting album.");
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    const isOwner = await isAlbumOwner(
      req.query.albumId,
      session.user.accountId
    );

    if (!isOwner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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

    return res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred while attempting to delete photo" });
  }
};

export const createAlbum = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const upload = multer({ storage: multer.memoryStorage() });
    upload.array("files")(req, res, async (error) => {
      if (error) {
        return res.status(500).json({
          message: "An error occurred while attempting to upload photos",
        });
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
        // Setting a new filename for each file in req.files
        const filename = v4();

        const storageRef = ref(
          storage,
          `users/${session.user.accountId}/${filename}`
        );

        const metadata = {
          contentType: file.mimetype,
        };

        const snapshot = await uploadBytes(storageRef, file.buffer, metadata);

        const photoURL = await getDownloadURL(snapshot.ref);

        const uploadedPhoto = await Photo.create({
          author_account_id: session.user.accountId,
          albums: [createdAlbum._id],

          filename,

          url: photoURL,

          uploaded_at: new Date(),
        });
      }
    });
    return res.status(200).json({ message: "Album created sucessfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while attempting to create album" });
  }
};

export const canUploadToAlbum = async (accountId, albumId) => {
  const exists = await Promise.all([
    accountExists(accountId),
    albumExists(albumId)
  ]);

  if (!exists[0] || !exists[1]) {
    return false;
  }

  const [isOwner, isContributor] = await Promise.all([
    isAlbumOwner(albumId, accountId),
    isAlbumContributor(albumId, accountId)
  ]);

  return isOwner || isContributor;
};
