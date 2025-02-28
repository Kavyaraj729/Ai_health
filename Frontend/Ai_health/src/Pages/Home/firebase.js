// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4_7_51SrVxbz_HXs-NUmVaemsZQBgy3s",
  authDomain: "aihealthcare-489cc.firebaseapp.com",
  projectId: "aihealthcare-489cc",
  storageBucket: "aihealthcare-489cc.firebasestorage.app",
  messagingSenderId: "235401988251",
  appId: "1:235401988251:web:16ce863bf6d12cce1b1e3e",
  measurementId: "G-CL8TC7HNV3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
