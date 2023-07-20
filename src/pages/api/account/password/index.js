import { updateAccountPassword } from "@/middlewares/account/password";

export default async function handler(req, res) {
  switch (req.method) {
    case "PUT":
      return await updateAccountPassword(req, res);

      break;

    default:
      return res.status(405).json({ message: "" });
      break;
  }
}
