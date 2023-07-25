import connection from "@/database/connection";
import Album from "@/database/models/Album";
import Photo from "@/database/models/Photo";
import { accountExists } from "../account";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Account from "@/database/models/Account";
import { getFirstPhotoInAlbum } from "../photo";
import moment from "moment/moment";
import Joi from "joi";
import { compareDates } from "@/utils/date";

export const albumExists = async (albumId) => {
  try {
    const db = await connection();
    const album = await Album.findById(albumId);

    const exists = album ? true : false;

    return exists;
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

    const album = await Album.findById(albumId);
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

    const isContributor = album.contributors.includes(accountId) ? true : false;

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

    const sortedAlbumPhotos = albumPhotos.sort(compareDates);

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

      photos: await Promise.all(
        sortedAlbumPhotos.map(
          async ({
            _id,
            author_account_id,
            albums,
            url,
            metadata,
            uploaded_at,
          }) => {
            const photoAuthor = await Account.findById(author_account_id);

            return {
              id: _id.toString(),
              author: {
                id: photoAuthor.id.toString(),
                firstname: photoAuthor.firstname,
                lastname: photoAuthor.lastname,
              },
              albums: albums.map((albumId) => albumId.toString()),
              url,
              metadata,
              uploaded_at: moment(uploaded_at).format(
                "MMMM Do YYYY, h:mm:ss a"
              ),
            };
          }
        )
      ),

      updated_at: moment(album.updated_at).format("MMMM Do YYYY, h:mm:ss a"),
      created_at: moment(album.created_at).format("MMMM Do YYYY, h:mm:ss a"),
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

    // Remove the deleted album ID from "albums" attribute in "Photo" model
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

    const existsAccount = await accountExists(accountId);

    if(!existsAccount){
      throw Error("Accout not found");
    }

    const existsAlbum = await albumExists(albumId);

    if(!existsAlbum){
      throw Error("Albumt not found");
    }

    const isOwner = await isAlbumOwner(albumId, accountId);

    const isContributor = await isAlbumContributor(albumId, accountId);

    const canUpload = isOwner || isContributor;

    return canUpload;
  } catch (error) {
    console.log(error)
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

    // Checking if the user making the request its the same as the contributor
    // who is trying to remove
    const isTheSameContributor =
      session.user.accountId === req.query.contributorId;

    if (!(isOwner || (isContributor && isTheSameContributor))) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updatedAlbum = await Album.findByIdAndUpdate(req.query.albumId, {
      $pull: { contributors: req.query.contributorId },
    });

    return res
      .status(200)
      .json({ message: "Album contributor removed successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while attempting to remove album contributor",
    });
  }
};

export const updateAlbumLastModification = async (albumId, date) => {
  try {
    const db = await connection();
    const existsAlbum = await albumExists(albumId);

    if (!existsAlbum) {
      throw Error("Album not found");
    }

    const updatedAlbum = await Album.findByIdAndUpdate(albumId, {
      updated_at: date,
    });

    return true;
  } catch (error) {
    throw Error(
      "An error occurred while attempting to update album last modification"
    );
  }
};

export const updateAlbumName = async (req, res) => {
  try {
    const nameSchema = Joi.string().min(1).max(256);

    const session = await getServerSession(req, res, authOptions);
    const isOwner = await isAlbumOwner(
      req.query.albumId,
      session.user.accountId
    );

    if (!isOwner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validationResult = await nameSchema.validateAsync(req.body.newName);

    if (validationResult.error) {
      return res.status(400).json({
        message: "Album name must be between 1 and 256 characters long.",
      });
    }

    await Album.findByIdAndUpdate(req.query.albumId, {
      name: req.body.newName,
    });

    return res.status(200).json({ message: "Updated album name successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while trying to update album name" });
  }
};

export const sendAlbumPhotos = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    const canUpload = await canUploadToAlbum(
      session.user.accountId,
      req.query.albumId
    );

    if (!canUpload) {
      return res.status(401).json({ message: "" });
    }

    const album = await getAlbum(req.query.albumId);
    const photos = album.photos;

    return res.status(200).json({ photos });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "" });
  }
};
