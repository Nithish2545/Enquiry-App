import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage ,  ref, getDownloadURL} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyANOCPfVpqRSxjuHnSUr38TchgToJL2CPc",
    authDomain: "enquiry-app-9d329.firebaseapp.com",
    projectId: "enquiry-app-9d329",
    storageBucket: "enquiry-app-9d329.appspot.com",
    messagingSenderId: "302000022569",
    appId: "1:302000022569:web:aef58bc0da8be4a3456838"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
