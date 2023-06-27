import { getFolderSize } from "@/utils/firebase-app";

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
