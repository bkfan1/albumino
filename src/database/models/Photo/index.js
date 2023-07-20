import { Schema, model, models } from "mongoose";

const PhotoSchema = new Schema(
  {
    author_account_id: {
      type: Schema.ObjectId,
      ref: "Account",
      required: true,
    },

    albums: [
      {
        type: Schema.ObjectId,
        ref: "Album",
      },
    ],

    filename: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    metadata: {
      type: Object,
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
