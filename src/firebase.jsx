import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

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

export const getPermission = async () => {
  const result = await Notification.requestPermission();
  console.log(result);
  await getToken(messaging, {
    vapidKey:
      "BIO8vv7plsr6ytibM7C9Au6wbw6FvWAom0XWRrgQc4p4KL8dIrb6mLey8P2HJRhvj81S8AgEG3E4xsBr2eVhf7w",
  })
    .then((currentToken) => {
      console.log(currentToken);
      if (currentToken) {
        console.log(currentToken);
        return currentToken;
      } else {
        console.log("Error");
        // utilityFunctions.ErrorNotify(
        //   "No registration token available. Request permission to generate one."
        // );
      }
    })
    .catch((err) => {
      console.log(err);
      // utilityFunctions.ErrorNotify("An error occurred while retrieving token!");
    });
};
