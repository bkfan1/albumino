import connection from "@/database/connection";
import Album from "@/database/models/Album";
import Photo from "@/database/models/Photo";
import { accountExists } from "../account";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Account from "@/database/models/Account";
import { getFirstPhotoInAlbum } from "../photo";

export const albumExists = async (albumId) => {
  try {
    const db = await connection();
    const foundAlbum = await Album.findById({ _id: albumId });

    return foundAlbum ? true : false;
  } catch (error) {
    throw Error("An error occurred while attempting to find album");
  }
};

export const isAlbumOwner = async (albumId, accountId) => {
  try {
    const db = await connection();

    const exists = await albumExists(albumId);

    if (!exists) {
      throw Error("Album not found");
    }

    const existsAccount = await accountExists(accountId);

    if (!existsAccount) {
      throw Error("Account not found");
    }

    const album = await Album.findById({ _id: albumId });
    const isOwner = album.author_account_id.toString() === accountId;

    return isOwner;
  } catch (error) {
    throw Error("An error occurred while checking album ownership.");
  }
};

export const isAlbumContributor = async (albumId, accountId) => {
  try {
    const db = await connection();
    const existsAlbum = await albumExists(albumId);

    if (!existsAlbum) {
      throw Error("Album not found");
    }

    const existsAccount = await accountExists(accountId);

    if (!existsAccount) {
      throw Error("Account not found");
    }

    const album = await Album.findById(albumId);

    const isContributor = album.contributors.includes(accountId);

    return isContributor;
  } catch (error) {
    console.log(error);
    throw Error("An error occurred while checking album contributor.");
  }
};

export const getAlbum = async (albumId) => {
  try {
    const db = await connection();
    const exists = await albumExists(albumId);

    if (!exists) {
      throw Error("Album not found");
    }

    const album = await Album.findById(albumId);

    const albumPhotos = await Photo.find({ albums: albumId });
    const albumContributors = await Account.find({
      _id: { $in: album.contributors },
    });

    const cover = await getFirstPhotoInAlbum(albumId);

    const data = {
      id: album._id.toString(),
      author_account_id: album.author_account_id.toString(),

      name: album.name,

      cover: cover ? cover.url : false,

      contributors: albumContributors.map(({ _id, firstname, lastname }) => ({
        id: _id.toString(),
        firstname,
        lastname,
      })),

      photos: albumPhotos.map(
        ({ _id, author_account_id, albums, url, uploaded_at }) => ({
          id: _id.toString(),
          author_account_id: author_account_id.toString(),
          albums: albums.map((albumId) => albumId.toString()),
          url,
          uploaded_at: uploaded_at.toString(),
        })
      ),

      updated_at: album.updated_at.toString(),
      created_at: album.created_at.toString(),
    };

    return data;
  } catch (error) {
    console.log(error);
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

    const deletedAlbum = await Album.findByIdAndDelete(req.query.albumId);

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

    const db = await connection();
    const existsAccount = await accountExists(session.user.accountId);

    if (!existsAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    const createdAlbum = await Album.create({
      author_account_id: session.user.accountId,
      contributors: [],

      name: req.body.name,

      created_at: new Date(),
      updated_at: new Date(),
    });

    const albumId = createdAlbum._id.toString();

    return res.status(200).json({ albumId });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred while attempting to create album" });
  }
};

export const canUploadToAlbum = async (accountId, albumId) => {
  try {
    const exists = await Promise.all([
      accountExists(accountId),
      albumExists(albumId),
    ]);

    if (!exists[0] || !exists[1]) {
      throw Error("Error while checking album permissions.");
    }

    const [isOwner, isContributor] = await Promise.all([
      isAlbumOwner(albumId, accountId),
      isAlbumContributor(albumId, accountId),
    ]);

    return isOwner || isContributor;
  } catch (error) {
    throw Error("Error while checking album permissions.");
  }
};

export const removeAlbumContributor = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    // Checking if the user who sent the request is the album owner
    const isOwner = await isAlbumOwner(
      req.query.albumId,
      session.user.accountId
    );

    // Checking if the contributorId from req.query is a contributor in this album
    const isContributor = await isAlbumContributor(
      req.query.albumId,
      req.query.contributorId
    );

    const isTheSameContributor =
      session.user.accountId === req.query.contributorId;

    if (!(isOwner || (isContributor && isTheSameContributor))) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updatedAlbum = await Album.findByIdAndUpdate(
      { _id: req.query.albumId },
      {
        $pull: { contributors: req.query.contributorId },
      }
    );

    return res
      .status(200)
      .json({ message: "Album contributor removed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message:
          "An error occurred while attempting to remove album contributor",
      });
  }
};
