import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCyzE09t21le-MPw7ZZT0_gHgspy703wIs",
    authDomain: "conquer-media.firebaseapp.com",
    projectId: "conquer-media",
    storageBucket: "conquer-media.appspot.com",
    messagingSenderId: "805250780228",
    appId: "1:805250780228:web:71e1cef9cbe35c595e4011",
    measurementId: "G-PPVP38LNZQ"
};

// Initialize with a unique name
const app = initializeApp(firebaseConfig, 'comments-app');
const db = initializeFirestore(app, { experimentalForceLongPolling: true, preferRest: true });
const storage = getStorage(app);

export { db, storage, collection, addDoc };
