export const updateAccountEmail = async (req, res) => {
    try {
      const session = await getServerSession(req, res, authOptions);
  
      const existsAccount = await accountExists(session.user.accountId);
  
      if (!existsAccount) {
        return res.status(404).json({ message: "Account not found" });
      }
  
      if (
        !regex.email.test(req.body.oldEmail) ||
        !(
          regex.email.test(req.body.newEmail) ||
          !regex.email.test(req.body.confirmNewEmail)
        )
      ) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const account = await Account.findById(session.user.accountId);
  
      if (!(account.email === req.body.oldEmail)) {
        return res.status(400).json({ message: "" });
      }
  
      if (!(req.body.newEmail === req.body.confirmNewEmail)) {
        return res
          .status(400)
          .json({ message: "New email and confirm email doesn't match" });
      }
  
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