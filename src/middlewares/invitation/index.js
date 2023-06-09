import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { albumExists, isAlbumContributor, isAlbumOwner } from "../album";
import connection from "@/database/connection";

import Album from "@/database/models/Album";
import AlbumInvitation from "@/database/models/AlbumInvitation";

import { createTransport } from "nodemailer";

export const invitationExists = async (invitationId) => {
  try {
    const foundInvitation = await AlbumInvitation.findById({
      _id: invitationId,
    });

    if (!foundInvitation) {
      return false;
    }

    return true;
  } catch (error) {
    throw Error("An error occurred while checking invitation existence.");
  }
};

export const isInvitationAuthor = async (invitationId, accountId) => {
  try {
    const foundInvitation = await invitationExists(invitationId);

    if (!foundInvitation) {
      throw Error("Invitation not found.");
    }

    const isAuthor = foundInvitation.sender_id === accountId;

    return isAuthor;
  } catch (error) {
    throw Error("An error occurred while checking invitation's author.");
  }
};

export const updateAlbumInvitation = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const isOwner = await isAlbumOwner(
      req.query.albumId,
      session.user.accountId
    );

    const isContributor = await isAlbumContributor(session.user.accountId);

    // Only users that aren't in the album can accept the invitation
    if (isOwner || isContributor) {
      return res.status(401).json({ message: "User is already on album" });
    }

    const db = await connection();

    let exists = await invitationExists(req.query.invitationId);

    if (!exists) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    const invitation = await AlbumInvitation.findById({
      _id: req.query.invitationId,
    });

    // If the invitation was already accepted, return 400 status code
    if (invitation.status === "accepted") {
      return res.status(400).json({ message: "Invitation already accepted" });
    }

    exists = await albumExists(invitation.album_id)

    // Verify if the album exists before updating it
    if(!exists){return res.status(404).json({message:"Album not found"})}

    // Otherwise, update the invitation status
    await AlbumInvitation.findByIdAndUpdate(
      { _id: req.query.invitationId },
      {
        status: req.body.status,
      }
    );

    // ...And update the album related to the current invitation by adding the new contributor account ID
    await Album.findByIdAndUpdate(
      { _id: req.query.albumId },
      { $push: { contributors: session.user.accountId } }
    );

    return res.status(200).json({ message: "Invitation updated succesfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "An error occurred while attempting to update invitation",
      });
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
    throw Error("An error occurred while attempting to send email.");
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
      return res.status(401).json({ message: "Unauthorized" });
    }

    const db = await connection();

    const createdInvitation = await AlbumInvitation.create({
      album_id: req.query.albumId,

      sender_id: session.user.accountId,

      status: "pending",

      created_at: new Date(),
    });

    // After creating the invitation in the database, send an email with a link to the invitation
    const sentEmail = await sendEmail(req.body);

    // If email was not sent, return 500 status code
    if (!sentEmail) {
      return res
        .status(500)
        .json({
          message:
            "An error occurred while attempting to send invitation email",
        });
    }

    // Otherwise, return 200
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "An error occurred while attempting to create invitation",
      });
  }
};
