// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getDatabase} from "firebase/database";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIGJjbIvYXggmYX6R_z2URZ_h5hC4mIN8",
  authDomain: "shopez-a3dec.firebaseapp.com",
  projectId: "shopez-a3dec",
  storageBucket: "shopez-a3dec.firebasestorage.app",
  messagingSenderId: "644234807011",
  appId: "1:644234807011:web:98e2706e02edfa3b2727d6",
  measurementId: "G-W6XDKB7N76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const auth = getAuth(app);