import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // 1. Import getFirestore

const firebaseConfig = {
    apiKey: "AIzaSyCxR9RH6tWBNmIxNi7u5VoXTlRoDpBr7SM",
  authDomain: "madweek8-ce993.firebaseapp.com",
  projectId: "madweek8-ce993",
  storageBucket: "madweek8-ce993.firebasestorage.app",
  messagingSenderId: "796636862004",
  appId: "1:796636862004:web:df1054812733a90400dc61",
  measurementId: "G-GQZ058EBBH"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);