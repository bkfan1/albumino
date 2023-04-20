import { Schema, model, models } from "mongoose";

const PhotoSchema = new Schema(
  {
    author_account_id: {
      type: Schema.ObjectId,
      ref: "Account",
      required: true,
    },

    album_id: {
      type: Schema.ObjectId,
      ref: "Album",
      default:null,
    },

    filename: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    uploaded_at: {
      type: Date,
      required: true,
    },
  },
  { collection: "photos" }
);

export default models.Photo || model("Photo", PhotoSchema);
