import { getFolderSize } from "@/utils/firebase-app";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { getAvailableSpace } from "@/middlewares/account/storage";

export const sendAccountStorageData = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const folderSizeInBytes = await getFolderSize(
      `users/${session.user.accountId}/`
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

    return res.status(200).json({storage: data})
  } catch (error) {
    return res
      .status(500)
      .json({
        message:
          "An error occurred while attempting to send account storage data",
      });
  }
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await sendAccountStorageData(req, res);
      break;

    default:
      return res.status(405).json({});
      break;
  }
}
