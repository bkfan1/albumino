const { Schema, model, models } = require("mongoose");

const AlbumSchema = new Schema(
  {
    author_account_id: {
      type: Schema.ObjectId,
      ref: "Account",
      required: true,
    },

    contributors: {
      type: Array,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    updated_at: {
      type: Date,
      required: true,
    },

    created_at: {
      type: Date,
      required: true,
    },
  },
  { collection: "albums" }
);

export default models.Album || model("Album", AlbumSchema);
