import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage ,  ref, getDownloadURL} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCXT0P7ORMI7WFf0yU6anrqRlnGywLDwRE",
    authDomain: "shiphitmobileapppickup.firebaseapp.com",
    projectId: "shiphitmobileapppickup",
    storageBucket: "shiphitmobileapppickup.appspot.com",
    messagingSenderId: "591798517548",
    appId: "1:591798517548:web:f205493abadedf270d3689"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);