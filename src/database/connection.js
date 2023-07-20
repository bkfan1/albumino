import { connect } from "mongoose";

export default async function connection() {
  try {
    const db = await connect(process.env.MONGODB_URI);
    return db;
  } catch (error) {
    throw Error("Error while attempting to connect to database.");
  }
}
