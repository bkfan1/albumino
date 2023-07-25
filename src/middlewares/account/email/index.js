import { accountExists } from "..";
import Account from "@/database/models/Account";
import connection from "@/database/connection";
import { getServerSession } from "next-auth";
import { updateAccountEmailSchema } from "@/utils/joi/schemas/account/email";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const updateAccountEmail = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    const existsAccount = await accountExists(session.user.accountId);

    if (!existsAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    // This only validates the following if req.body has valid oldEmail, newEmail, confirmNewEmail
    // and if newEmail and confirmNewEmail are the same
    // The validation for checking if oldEmail is equal to current user password
    // is in a few lines bellow
    const validationResult = await updateAccountEmailSchema.validateAsync(
      req.body
    );

    if (validationResult.error) {
      return res.status(400).json({ message: "" });
    }

    const db = await connection();

    const account = await Account.findById(session.user.accountId);

    // If oldEmail does not match with account current email
    if (req.body.oldEmail !== account.email) {
      return res.status(400).json({ message: "Emails don't match" });
    }

    // If req.body.newEmail is the same email as the current account email
    if (req.body.newEmail === account.email) {
      return res.status(400).json({
        message: "New account email must be different from your current email",
      });
    }

    const emailTaken = await Account.findOne({ email: req.body.newEmail });

    if (emailTaken) {
      return res
        .status(400)
        .json({ message: "Email taken, please use a different email" });
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      session.user.accountId,
      {
        email: req.body.newEmail,
      }
    );

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while trying to update account password",
    });
  }
};
