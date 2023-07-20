import { initializeApp } from "firebase/app";
import {
  deleteObject,
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getMetadata,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const uploadFile = async (path, fileBuffer, metadata) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, fileBuffer, metadata);

    return snapshot;
  } catch (error) {
    throw Error("An error ocurred while attempting to upload file");
  }
};

export const deleteFile = async (fileURL) => {
  try {
    const storageRef = ref(storage, fileURL);
    return await deleteObject(storageRef);
  } catch (error) {
    throw Error("An error ocurred while attempting to delete file");
  }
};

export const getFolderSize = async (folderPath) => {
  try {
    const folderRef = ref(storage, folderPath);

    const files = await listAll(folderRef);

    let totalFolderSize = 0;

    await Promise.all(
      files.items.map(async (file) => {
        const metadata = await getMetadata(file);

        totalFolderSize += metadata.size;
      })
    );

    return totalFolderSize;
  } catch (error) {
    console.log(error);
    throw Error("An error occurred while trying to get folder size");
  }
};
