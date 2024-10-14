import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage ,  ref, getDownloadURL} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBQ4xQo_SL-lIYEp0Un27oXeKPYQjInIA8",
    authDomain: "enquiry-app-a4bfc.firebaseapp.com",
    projectId: "enquiry-app-a4bfc",
    storageBucket: "enquiry-app-a4bfc.appspot.com",
    messagingSenderId: "696048176954",
    appId: "1:696048176954:web:286ea6122e2c5047ae8a03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);