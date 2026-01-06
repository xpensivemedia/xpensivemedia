import { initializeApp } from "firebase/app";
import { initializeFirestore, collection, addDoc } from "firebase/firestore"


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqvldVtyKS-xnXp2SYfq-uR5BnasyhEeI",
    authDomain: "xpensive-media.firebaseapp.com",
    projectId: "xpensive-media",
    storageBucket: "xpensive-media.firebasestorage.app",
    messagingSenderId: "302194834178",
    appId: "1:302194834178:web:2156ae33f9bd3ad9ace01b",
    measurementId: "G-ZWNFX2S4Y8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { experimentalForceLongPolling: true, preferRest: true });

export { db, collection, addDoc };
