import { getAccountStorageData } from "@/middlewares/account";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getAccountStorageData(req, res);
      break;

    default:
      return res.status(405).json({})
      break;
  }
}
