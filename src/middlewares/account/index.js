import connection from "@/database/connection";
import Account from "@/database/models/account";
import Album from "@/database/models/album";
import Photo from "@/database/models/photo";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import accountSchema from "@/utils/joi/schemas/account";
import { hash } from "bcrypt";
import { getServerSession } from "next-auth";

export const accountExists = async (accountId) => {
  try {
    const db = await connection();
    const account = await Account.findById({ _id: accountId });

    if (!account) {
      return false;
    }
    return true;
  } catch (error) {
    throw Error("An error occurred while attempting to find the account.");
  }
};

export const createAccount = async (req, res) => {
  try {
    await accountSchema.validateAsync(req.body);

    const db = await connection();

    const foundAccount = await Account.findOne({ email: req.body.email });

    if (foundAccount) {
      return res
        .status(400)
        .json({ message: "An account with this email is already in use." });
    }

    const hashedPassword = await hash(req.body.password, 10);

    const createdAccount = await Account.create({
      email: req.body.email,
      password: hashedPassword,

      firstname: req.body.firstname,
      lastname: req.body.lastname,

      created_at: new Date(),
    });

    return res.status(200).json({ message: "Account created succesfully." });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "An error occurred while attempting to create the account.",
      });
  }
};

export const getAccountAlbums = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const exists = await accountExists(session.user.accountId);

    if (!exists) {
      return res.status(404).json({});
    }

    const db = await connection();
    const accountAlbums = await Album.find({
      author_account_id: session.user.accountId,
    });

    const albums = [];

    for (const album of accountAlbums) {
      const albumPhotos = await Photo.find({ albums: album._id });

      albums.push({
        id: album._id.toString(),
        name: album.name,

        photos: albumPhotos.map((album) => ({
          id: album._id.toString(),
          url: album.url,
          uploaded_at: album.uploaded_at,
        })),

        created_at: album.created_at,
        updated_at: album.updated_at,
      });
    }

    return res.status(200).json({ albums });
  } catch (error) {
    return res.status(500).json({});
  }
};
