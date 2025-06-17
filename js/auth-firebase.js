// auth-firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDA5lWSrkpCC7NmViHqrWz0CwatY-fPGXk",
  authDomain: "tokoku-1.firebaseapp.com",
  projectId: "tokoku-1",
  storageBucket: "tokoku-1.appspot.com",
  messagingSenderId: "101943300569",
  appId: "1:101943300569:web:82a89c9d9a4ee6c4f589c8",
  measurementId: "G-MJW8D76BW5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);