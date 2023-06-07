import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { isAlbumOwner } from "../album";
import connection from "@/database/connection";

import Album from "@/database/models/Album";
import AlbumInvitation from "@/database/models/AlbumInvitation";

import { createTransport } from "nodemailer";



export const invitationExists = async (invitationId)=>{
  try {
    const foundInvitation = await AlbumInvitation.findById({_id: invitationId})
    if(!foundInvitation){return false;}

    return true;

    
  } catch (error) {
    return false;
  }
}

export const isInvitationAuthor = async (invitationId, accountId)=>{
  try {
    const foundInvitation = await invitationExists(invitationId);

    if(!foundInvitation){return false}

    return foundInvitation.sender_id === accountId

  } catch (error) {
    return false;
  }
}

export const updateAlbumInvitation = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const isOwner = await isAlbumOwner(
      req.query.albumId,
      session.user.accountId
    );

    if (isOwner) {
      return res.status(403).json({});
    }

    const db = await connection();

    const exists = await invitationExists(req.query.invitationId);

    if(!exists){return res.status(404).json({})}

    const invitation = await AlbumInvitation.findById({_id: req.query.invitationId});

    if(invitation.status === "accepted"){return res.status(400).json({})}

    await AlbumInvitation.findByIdAndUpdate(
      { _id: req.query.invitationId },
      {
        status: req.body.status,
      }
    );

    await Album.findByIdAndUpdate(
      { _id: req.query.albumId },
      { $push: { contributors: session.user.accountId } }
    );

    return res.status(200).json({});


  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const sendEmail = async (data) => {
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

export const createAlbumInvitation = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const isOwner = await isAlbumOwner(
      req.query.albumId,
      session.user.accountId
    );

    if (!isOwner) {
      return res.status(403).json({});
    }

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
