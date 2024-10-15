// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-5e200.firebaseapp.com",
  projectId: "mern-auth-5e200",
  storageBucket: "mern-auth-5e200.appspot.com",
  messagingSenderId: "978413331949",
  appId: "1:978413331949:web:f4aa8def4f0c215dfc73e4"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);