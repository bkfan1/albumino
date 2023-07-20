import { Schema, models, model } from "mongoose";

const AlbumInvitationSchema = new Schema(
  {
    album_id: {
      type: Schema.ObjectId,
      ref: "Albums",
      required: true,
    },

    sender_id: {
      type: Schema.ObjectId,
      ref: "Accounts",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },

    created_at: {
      type: Date,
    },
  },
  { collection: "albumInvitations" }
);

export default models.AlbumInvitation ||
  model("AlbumInvitation", AlbumInvitationSchema);
