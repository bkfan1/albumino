import { createAccount } from "@/middlewares/account";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return await createAccount(req, res);

      break;

    default:
      return res.status(405).json({ message: "" });
      break;
  }
}
