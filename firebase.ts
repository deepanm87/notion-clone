import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyARrrnEMEmzTv0yceSOhBVeV7TSMULiBZQ",
  authDomain: "notion-clone-b92f3.firebaseapp.com",
  projectId: "notion-clone-b92f3",
  storageBucket: "notion-clone-b92f3.firebasestorage.app",
  messagingSenderId: "882799701009",
  appId: "1:882799701009:web:44c2c9ef5bdfbc59bbd5b0"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)

export { db }



