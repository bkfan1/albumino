import connection from "@/database/connection";
import AlbumInvitation from "@/database/models/AlbumInvitation";
import Album from "@/database/models/album";
import { isAlbumOwner } from "@/middlewares/album";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

const updateAlbumInvitation = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const isOwner = await isAlbumOwner(
      req.query.albumId,
      session.user.accountId
    );

    if (isOwner) {
      return res.status(400).json({});
    }

    const db = await connection();

    const updatedInvitation = await AlbumInvitation.findByIdAndUpdate(
      { _id: req.query.invitationId },
      {
        status: req.body.status,
      }
    );

    if (req.body.status === "accepted") {
      await Album.findByIdAndUpdate(
        { _id: updated.album_id },
        { $push: { contributors: session.user.accountId } }
      );
    }

    return res.status(200).json({});
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export default async function handler(req, res) {
  switch (req.method) {
    case "PUT":
      return await updateAlbumInvitation(req, res);
      break;

    default:
      return res.status(405).json({});
      break;
  }
}
