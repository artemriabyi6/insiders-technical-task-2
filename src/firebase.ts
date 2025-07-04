import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoVqyeTtPGZot-3yVmWjy4ppSwY_rvhts",
  authDomain: "todo-list-3dd69.firebaseapp.com",
  projectId: "todo-list-3dd69",
  storageBucket: "todo-list-3dd69.firebasestorage.app",
  messagingSenderId: "147495344458",
  appId: "1:147495344458:web:177a4e95a15e2e007c09b3",
  measurementId: "G-H1LDEJLXYC",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

