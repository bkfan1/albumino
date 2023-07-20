import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { albumExists, isAlbumContributor, isAlbumOwner } from "../album";
import connection from "@/database/connection";

import Album from "@/database/models/Album";
import AlbumInvitation from "@/database/models/AlbumInvitation";

import { createTransport } from "nodemailer";
import Account from "@/database/models/Account";
import {
  domain,
  generateInvitationHTMLString,
  generateInvitationLink,
} from "@/utils/constants";
import { accountExists } from "../account";

export const invitationExists = async (invitationId) => {
  try {
    const invitation = await AlbumInvitation.findById(invitationId);

    const exists = invitation ? true : false;

    return exists;
  } catch (error) {
    throw Error("An error occurred while checking invitation existence");
  }
};

export const isInvitationAuthor = async (invitationId, accountId) => {
  try {
    const existsInvitation = await invitationExists(invitationId);

    if (!existsInvitation) {
      throw Error("Invitation not found");
    }

    const existsAccount = await accountExists(accountId);

    if (!existsAccount) {
      throw Error("Account not found");
    }

    const foundInvitation = await AlbumInvitation.findById(invitationId);

    const isAuthor = foundInvitation.sender_id.toString() === accountId;

    return isAuthor;
  } catch (error) {
    throw Error("An error occurred while checking invitation's author.");
  }
};

export const updateAlbumInvitation = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    const db = await connection();

    const existsInvitation = await invitationExists(req.query.invitationId);

    if (!existsInvitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    const isAuthor = await isInvitationAuthor(
      req.query.invitationId,
      session.user.accountId
    );

    const isContributor = await isAlbumContributor(
      req.query.albumId,
      session.user.accountId
    );

    // Only users that are not in the album can accept the invitation

    if (isAuthor || isContributor) {
      return res.status(401).json({
        message:
          "Only users that are not in the album can accept the invitation",
      });
    }

    const invitation = await AlbumInvitation.findById(req.query.invitationId);

    // If the invitation was already accepted, return 400 status code
    if (invitation.status === "accepted") {
      return res.status(400).json({ message: "Invitation expired" });
    }

    // Verify if the album exists before updating it
    const existsAlbum = await albumExists(req.query.albumId);

    if (!existsAlbum) {
      return res.status(404).json({ message: "Album not found" });
    }

    // Otherwise, update the invitation status
    await AlbumInvitation.findByIdAndUpdate(req.query.invitationId, {
      status: "accepted",
    });

    // ...And update the album related to the current invitation by adding the new contributor account ID
    // to "contributors" attribute
    await Album.findByIdAndUpdate(req.query.albumId, {
      $push: { contributors: session.user.accountId },
    });

    return res.status(200).json({ message: "Invitation updated succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
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
      html: generateInvitationHTMLString(data),
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

    const invitationLink = generateInvitationLink(
      domain,
      createdInvitation._id.toString()
    );

    // Send an email with a link to the invitation if it is required
    if (req.body.sendEmail === true) {
      // Getting the details about the album and his album
      const author = await Account.findById(session.user.accountId);
      const album = await Album.findById(req.query.albumId);

      const data = {
        ...req.body,
        subject: "Invitation to album",
        author: {
          fullname: `${author.firstname} ${author.lastname}`,
        },
        album: {
          name: album.name,
        },
        link: invitationLink,
      };

      // Sending an email that contains a invitation link to join the album
      const sentEmail = await sendEmail(data);

      // If email was not sent, return 500 status code
      if (!sentEmail) {
        return res.status(500).json({
          message:
            "An error occurred while attempting to send invitation email",
        });
      }
    }

    return res.status(200).json({ invitationLink });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while attempting to create invitation",
    });
  }
};
