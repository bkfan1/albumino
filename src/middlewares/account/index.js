import connection from "@/database/connection";
import Account from "@/database/models/Account";
import Album from "@/database/models/Album";
import Photo from "@/database/models/Photo";
import { hash } from "bcrypt";
import { getFirstPhotoInAlbum } from "../photo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { accountSchema } from "@/utils/joi/schemas/account";
import moment from "moment/moment";
import { passwordSalt } from "@/utils/constants";
import { compareDates } from "@/utils/date";

export const accountExists = async (accountId) => {
  try {
    const db = await connection();
    const account = await Account.findById({ _id: accountId });
    const exists = account ? true : false;

    return exists;
  } catch (error) {
    throw Error("An error occurred while finding the account");
  }
};

export const createAccount = async (req, res) => {
  try {
    const validationResult = await accountSchema.validateAsync(req.body);

    if (validationResult.error) {
      return res.status(400).json({ message: "Bad credentials" });
    }

    const db = await connection();

    const emailTaken = await Account.findOne({ email: req.body.email });

    if (emailTaken) {
      return res.status(400).json({ message: "Email taken" });
    }

    const hashedPassword = await hash(req.body.password, passwordSalt);

    const createdAccount = await Account.create({
      email: req.body.email,
      password: hashedPassword,

      firstname: req.body.firstname,
      lastname: req.body.lastname,

      created_at: new Date(),
    });

    return res.status(200).json({ message: "Account created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while attempting to create account",
    });
  }
};

export const getAccountPhotos = async (accountId) => {
  try {
    const db = await connection();

    const exists = await accountExists(accountId);

    if (!exists) {
      throw Error("Account not found");
    }

    const photos = await Photo.find({
      author_account_id: accountId,
    });

    const sortedPhotos = photos.sort(compareDates);

    const author = await Account.findById(accountId);

    const data = sortedPhotos.map(
      ({ _id, albums, url, metadata, uploaded_at }) => {
        const photo = {
          id: _id.toString(),
          author: {
            id: author._id.toString(),
            firstname: author.firstname,
            lastname: author.lastname,
          },
          albums: albums.map((albumId) => albumId.toString()),
          url,
          metadata,
          uploaded_at: moment(uploaded_at).format("MMMM Do YYYY, h:mm:ss a"),
        };

        return photo;
      }
    );

    return data;
  } catch (error) {
    throw Error("An error occurred while attempting to get account photos");
  }
};

export const getAccountAlbums = async (accountId, albumType = "own") => {
  try {
    const exists = await accountExists(accountId);

    if (!exists) {
      throw Error("Account doesn't exists");
    }

    const db = await connection();

    let foundAlbums;

    if (albumType === "own") {
      foundAlbums = await Album.find({ author_account_id: accountId });
    }

    if (albumType === "shared") {
      foundAlbums = await Album.find({ contributors: accountId });
    }

    const albums = [];

    for (const album of foundAlbums) {
      const albumPhotos = await Photo.find({ albums: album._id });
      const cover = await getFirstPhotoInAlbum(album._id.toString());

      albums.push({
        id: album._id.toString(),
        name: album.name,
        cover: cover ? cover.url : false,

        photos: albumPhotos.map((photo) => ({
          id: photo._id.toString(),
          url: photo.url,
          uploaded_at: moment(photo.uploaded_at).format(
            "MMMM Do YYYY, h:mm:ss a"
          ),
        })),

        created_at: moment(album.created_at).format("MMMM Do YYYY, h:mm:ss a"),

        updated_at: moment(album.updated_at).format("MMMM Do YYYY, h:mm:ss a"),
      });
    }

    return albums;
  } catch (error) {
    throw Error("An error occurred while attempting to get account albums.");
  }
};

export const sendAccountAlbums = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    const existsAccount = await accountExists(session.user.accountId);

    if (!existsAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    const albums = await getAccountAlbums(session.user.accountId, "own");

    return res.status(200).json({ albums });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while attempting to fetch account albums",
    });
  }
};

export const sendAccountPhotos = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    const existsAccount = await accountExists(session.user.accountId);

    if (!existsAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    const photos = await getAccountPhotos(session.user.accountId);

    return res.status(200).json({ photos });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while trying to send account photos",
    });
  }
};

export const findAccountByEmail = async (email) => {
  try {
    const db = await connection();

    const account = await Account.findOne({ email });
    const found = account ? true : false;

    return found;
  } catch (error) {
    console.log(error)
    throw Error("An error occurred while searching account");
  }
};
