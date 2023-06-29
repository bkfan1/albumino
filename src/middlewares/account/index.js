import connection from "@/database/connection";
import Account from "@/database/models/Account";
import Album from "@/database/models/Album";
import Photo from "@/database/models/Photo";
import { hash } from "bcrypt";
import { getFirstPhotoInAlbum } from "../photo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { calculateFolderSize } from "@/utils/firebase-app";
import { accountSchema } from "@/utils/joi/schemas/account";

export const accountExists = async (accountId) => {
  try {
    const db = await connection();
    const account = await Account.findById({ _id: accountId });

    return account ? true : false;
  } catch (error) {
    throw Error("An error occurred while finding the account");
  }
};

export const createAccount = async (req, res) => {
  try {
    const validationResult = await accountSchema.validateAsync(req.body);

    if (validationResult.error) {
      return res.status(400).json({});
    }

    const db = await connection();

    const emailTaken = await Account.findOne({ email: req.body.email });

    if (emailTaken) {
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
      throw Error("Account doesn't found");
    }

    const photos = await Photo.find({
      author_account_id: accountId,
    });

    const data = photos.map(({ _id, author_account_id, albums, url }) => ({
      id: _id.toString(),
      author_account_id: author_account_id.toString(),
      albums: albums.map((albumId) => albumId.toString()),
      url,
    }));

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

export const getAccountStorageData = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    const existsAccount = await accountExists(session.user.accountId);

    if (!existsAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    const folderPath = `/users/${session.user.accountId}/`;

    // Getting used storage value in bytes
    const usedStorageInBytes = await calculateFolderSize(folderPath);

    // Converting used storage value to MB
    const mb = usedStorageInBytes / 1e6;

    // Converting used storage value to percentage
    const percent = (mb * 100) / 100;

    const storage = {
      used: {
        bytes: usedStorageInBytes,
        mb,
        percent,
      },
    };

    return res.status(200).json({ storage });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while obtaining account storage data",
    });
  }
};

export const sendAccountPhotos = async (req, res)=>{
  try {
    const session = await getServerSession(req, res, authOptions);

    const existsAccount = await accountExists(session.user.accountId);

    if(!existsAccount){
      return res.status(404).json({message:"Account not found"})
    }

    const photos = await getAccountPhotos(session.user.accountId);

    return res.status(200).json({photos});

  } catch (error) {
    
  }

}