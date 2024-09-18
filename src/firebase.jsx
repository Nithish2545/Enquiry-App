import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage ,  ref, getDownloadURL} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBya4AHZMtV4CehMfYYaOiuKcP_H4PfGwI",
    authDomain: "enquiry-app-shiphit.firebaseapp.com",
    projectId: "enquiry-app-shiphit",
    storageBucket: "enquiry-app-shiphit.appspot.com",
    messagingSenderId: "984883716948",
    appId: "1:984883716948:web:2296df7ae1623e4d031ec1" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);