import { getServerSession } from "next-auth";
import { accountExists } from "..";
import Account from "@/database/models/Account";
import { compare, hash } from "bcrypt";
import { updatePasswordSchema } from "@/utils/joi/schemas/account/password";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { passwordSalt } from "@/utils/constants";

export const updateAccountPassword = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const existsAccount = await accountExists(session.user.accountId);

    if (!existsAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    // This only validates if req.body has oldPassword, newPassword and confirmNewPassword,
    // and if newPassword and confirmNewPassword are the same
    // The validation for checking if oldPassword its equal to account current password
    // is in a few lines bellow
    const validationResult = await updatePasswordSchema.validateAsync(req.body);

    if (validationResult.error) {
      return res.status(400).json({ message: "" });
    }

    const account = await Account.findById(session.user.accountId);

    // Comparing oldPassword with the account current password
    const matchWithAccountPassword = await compare(
      req.body.oldPassword,
      account.password
    );

    // if the incoming value in req.body.oldPassword is not the same as the account current password
    if (!matchWithAccountPassword) {
      return res.status(400).json({ message: "Old passwords don't match" });
    }

    const isCurrentPasswordMatchingNewPassword = await compare(
      req.body.newPassword,
      account.password
    );

    // If the new password it's the same as the account current password, then...
    if (isCurrentPasswordMatchingNewPassword) {
      return res.status(400).json({
        message: "New password has to be different from current password",
      });
    }

    const newPasswordHash = await hash(req.body.newPassword, passwordSalt);

    const updatedAccount = await Account.findByIdAndUpdate(
      session.user.accountId,
      {
        password: newPasswordHash,
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
