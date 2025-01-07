import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";
import toast from "react-hot-toast";
import utilityFunctions from "./Utility/utilityFunctions";

const firebaseConfig = {
  apiKey: "AIzaSyAwHe1Ci22MD09r-skn7OZLyYBdEX35L74",
  authDomain: "shiphitmobileapppickup-4d0a1.firebaseapp.com",
  projectId: "shiphitmobileapppickup-4d0a1",
  storageBucket: "shiphitmobileapppickup-4d0a1.appspot.com",
  messagingSenderId: "977746945332",
  appId: "1:977746945332:web:17c4aa3b217b35cf58f161",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore();
export const messaging = getMessaging();

export const generateToken = async () => {
  await getToken(messaging, {
    vapidKey:
      "BMnNnQ4wSQVf1bXSOE-_iuTEYhpUt99RBRh4fssB83LBIVABpz97T1fVqt1EqiXLS9DKaM4gygiPUsx2-RoSUz4",
  })
    .then((currentToken) => {
      if (currentToken) {
        return currentToken;
      } else {
        utilityFunctions.ErrorNotify(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      utilityFunctions.ErrorNotify("An error occurred while retrieving token!");
    });
};

export const getPermission = async () => {
  await Notification.requestPermission();
};
