// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const apiKEY = process.env.REACT_APP_API_KEY
const firebaseConfig = {
  apiKey: apiKEY,
  authDomain: "expense-tracker-978fe.firebaseapp.com",
  projectId: "expense-tracker-978fe",
  storageBucket: "expense-tracker-978fe.appspot.com",
  messagingSenderId: "563537378817",
  appId: "1:563537378817:web:2c77e4deefe7f4ebb7ca00",
  measurementId: "G-4SYVYFVRRV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);  
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)

// firebase login
// firebase init
// firebase deploy