import { Schema, model, models } from "mongoose";

const AccountSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minLength: 8,
    },

    firstname: {
      type: String,
      required: true,
    },

    lastname: {
      type: String,
      required: true,
    },

    created_at: {
      type: Date,
      required: true,
    },
  },
  { collection: "accounts" }
);

export default models.Account || model("Account", AccountSchema);
