import { accountExists } from "..";
import Account from "@/database/models/Account";
import connection from "@/database/connection";
import { getServerSession } from "next-auth";
import { updateAccountEmailSchema } from "@/utils/joi/schemas/account/email";

export const updateAccountEmail = async (req, res) => {
    try {
      const session = await getServerSession(req, res, authOptions);
  
      const existsAccount = await accountExists(session.user.accountId);
  
      if (!existsAccount) {
        return res.status(404).json({ message: "Account not found" });
      }

      const validationResult = await updateAccountEmailSchema.validateAsync(req.body);

      if(validationResult.error){
        return res.status(400).json({});
      }

      const db = await connection();
  
      const account = await Account.findById(session.user.accountId);
  
      const updatedAccount = await Account.findByIdAndUpdate(
        session.user.accountId,
        {
          email: req.body.newEmail,
        }
      );
  
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "An error occurred while trying to update account password",
        });
    }
  };