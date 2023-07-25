import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getFolderSize } from "@/utils/firebase-app";
import { getServerSession } from "next-auth";
import { accountExists } from "..";

export const getAvailableSpace = async (accountId) => {
  try {
    const totalSpace = 1e8; // 100 MB in Bytes
    const consumedSpace = await getFolderSize(`/users/${accountId}/`);
    const availableSpace = totalSpace - consumedSpace;
    return availableSpace;
  } catch (error) {
    throw Error("An error occurred while getting available space");
  }
};

export const sendAccountStorageData = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const existsAccount = await accountExists(session.user.accountId);

    if (!existsAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    const folderSizeInBytes = await getFolderSize(
      `/users/${session.user.accountId}/`
    );

    const mb = folderSizeInBytes / 1e6;
    const percent = (mb * 100) / 100;

    const data = {
      used: {
        bytes: folderSizeInBytes,
        mb,
        percent,
      },
    };

    return res.status(200).json({ storage: data });
  } catch (error) {
    return res.status(500).json({
      message:
        "An error occurred while attempting to send account storage data",
    });
  }
};
