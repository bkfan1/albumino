import connection from "@/database/connection";
import Account from "@/database/models/account";
import Album from "@/database/models/album";
import Photo from "@/database/models/photo";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
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
    throw Error("");
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

    return res.status(200).json({albums})
  } catch (error) {
    console.log(error)
    return res.status(500).json({})
  }
};
