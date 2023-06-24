
export const updateAccountPassword = async (req, res) => {
    try {
      const session = await getServerSession(req, res, authOptions);
      const existsAccount = await accountExists(session.user.accountId);
  
      if (!existsAccount) {
        return res.status(404).json({ message: "Account not found" });
      }
  
      if (!(req.body.newPassword === req.body.confirmNewPassword)) {
        return res
          .status(400)
          .json({ message: "New password and confirm new password dont match" });
      }
  
      const account = await Account.findById(session.user.accountId);
  
      const match = await compare(req.body.oldPassword, account.password);
  
      if (!match) {
        return res.status(400).json({ message: "Passwords dont match" });
      }
  
      const newPasswordHash = await hash(req.body.newPassword, 10);
  
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
  
  
  
  