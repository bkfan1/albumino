import connection from "@/database/connection";
import AlbumInvitation from "@/database/models/AlbumInvitation";
import { isAlbumOwner } from "@/middlewares/album";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { createTransport } from "nodemailer";

const sendEmail = async (data) => {
  try {
    const transporter = createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,

      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: data.email,

      subject: data.subject,

      text: data.text,
    });

    return true;
  } catch (error) {
    throw Error("");
  }
};

const createAlbumInvitation = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const isOwner = await isAlbumOwner(req.query.albumId, session.user.accountId);

    if(!isOwner){return res.status(403).json({})}

    const db = await connection();

    const createdInvitation = await AlbumInvitation.create({
      album_id: req.query.albumId,

      sender_id: session.user.accountId,

      status: "pending",

      created_at: new Date(),
    });

    const sentInvitationEmail = await sendEmail(req.body);

    return res.status(200).json({});
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return await createAlbumInvitation(req, res);

      break;

    default:
      return res.status(405).json({});
      break;
  }
}
