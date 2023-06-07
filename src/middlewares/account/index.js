import connection from "@/database/connection";
import Account from "@/database/models/Account";
import Album from "@/database/models/Album";
import Photo from "@/database/models/Photo";
import accountSchema from "@/utils/joi/schemas/account";
import { hash } from "bcrypt";

export const accountExists = async (accountId) => {
  try {
    const db = await connection();
    const account = await Account.findById({ _id: accountId });

    if (!account) {
      return false;
    }
    return true;
  } catch (error) {
    throw Error("An error occurred while finding the account.");
  }
};

export const createAccount = async (req, res) => {
  try {
    await accountSchema.validateAsync(req.body);

    const db = await connection();

    const foundAccount = await Account.findOne({ email: req.body.email });

    if (foundAccount) {
      return res.status(400).json({ message: "Email taken" });
    }

    const hashedPassword = await hash(req.body.password, 10);

    const createdAccount = await Account.create({
      email: req.body.email,
      password: hashedPassword,

      firstname: req.body.firstname,
      lastname: req.body.lastname,

      created_at: new Date(),
    });

    return res.status(200).json({ message: "Account created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "An error occurred while attempting to create account",
      });
  }
};

export const getAccountPhotos = async (accountId) => {
  try {
    const db = await connection();

    const photos = await Photo.find({
      author_account_id: accountId,
    }).sort({ uploaded_at: "desc" });

    return photos.map(({ _id, albums, url }) => ({
      id: _id.toString(),
      albums: albums.map((albumId) => albumId.toString()),
      url,
    }));
  } catch (error) {
    throw Error("An error occurred while attempting to get account photos.");
  }
};

export const getAccountAlbums = async (accountId) => {
  try {
    const exists = await accountExists(accountId);

    if (!exists) {
      return false;
    }

    const db = await connection();
    const accountAlbums = await Album.find({
      author_account_id: accountId,
    });

    const albums = [];

    for (const album of accountAlbums) {
      const albumPhotos = await Photo.find({ albums: album._id });

      albums.push({
        id: album._id.toString(),
        name: album.name,

        photos: albumPhotos.map((photo) => ({
          id: photo._id.toString(),
          url: photo.url,
          uploaded_at: photo.uploaded_at.toString(),
        })),

        created_at: album.created_at.toString(),
        updated_at: album.updated_at.toString(),
      });
    }

    return albums;
  } catch (error) {
    throw Error("An error occurred while attempting to get account albums.");
  }
};
