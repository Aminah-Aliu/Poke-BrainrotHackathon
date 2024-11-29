// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGJBC4RR2yv9s5re2eqt7611DLda-VznY",
  authDomain: "poke-87981.firebaseapp.com",
  projectId: "poke-87981",
  storageBucket: "poke-87981.firebasestorage.app",
  messagingSenderId: "749993723959",
  appId: "1:749993723959:web:793824a0ca924bc4b817b2",
  measurementId: "G-3CFJ8VWY2R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)

export { app, auth };