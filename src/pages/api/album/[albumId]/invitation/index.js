import connection from "@/database/connection";
import AlbumInvitation from "@/database/models/AlbumInvitation";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { createTransport } from "nodemailer";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      try {
        const session = await getServerSession(req, res, authOptions);
        const db = await connection();
        const invitation = await AlbumInvitation.create({
          album_id: req.query.albumId,

          sender_id: session.user.accountId,

          status: "pending",

          created_at: new Date(),
        });

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
          to: req.body.email,

          subject: req.body.subject,

          text: `Someone invited you to album`,
        });

        return res.status(200).json({});
      } catch (error) {
        console.log(error);
        return res.status(500).json({});
      }

      break;

    default:
      return res.status(405).json({});
      break;
  }
}
