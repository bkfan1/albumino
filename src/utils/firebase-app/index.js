// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGodV6Aswm8pAFEitquTIWZl-yTaxp2Tk",
  authDomain: "albumino-2e5c7.firebaseapp.com",
  projectId: "albumino-2e5c7",
  storageBucket: "albumino-2e5c7.appspot.com",
  messagingSenderId: "612643855230",
  appId: "1:612643855230:web:e368cb368865811fed312f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);