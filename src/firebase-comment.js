import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqvldVtyKS-xnXp2SYfq-uR5BnasyhEeI",
    authDomain: "xpensive-media.firebaseapp.com",
    projectId: "xpensive-media",
    storageBucket: "xpensive-media.firebasestorage.app",
    messagingSenderId: "302194834178",
    appId: "1:302194834178:web:2156ae33f9bd3ad9ace01b",
    measurementId: "G-ZWNFX2S4Y8"
};

// Initialize with a unique name
const app = initializeApp(firebaseConfig, 'comments-app');
const db = initializeFirestore(app, { experimentalForceLongPolling: true, preferRest: true });
const storage = getStorage(app);

export { db, storage, collection, addDoc };
