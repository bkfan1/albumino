import { sendAccountStorageData } from "@/middlewares/account/storage";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await sendAccountStorageData(req, res);
      break;

    default:
      return res.status(405).json({ message: "" });
      break;
  }
}
