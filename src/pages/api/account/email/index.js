import { updateAccountEmail } from "@/middlewares/account/email";

export default async function handler(req, res) {
  switch (req.method) {
    case "PUT":
      return await updateAccountEmail(req, res);

      break;

    default:
      return res.status(405).json({ message: "" });
      break;
  }
}
