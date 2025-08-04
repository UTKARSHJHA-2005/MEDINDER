import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCh-i4fDnJ76WsbdFJn-2Oh-pT2F4wzQqM",
  authDomain: "medicine-3ff21.firebaseapp.com",
  projectId: "medicine-3ff21",
  storageBucket: "medicine-3ff21.firebasestorage.app",
  messagingSenderId: "521789138294",
  appId: "1:521789138294:web:6deaaf32b6c48e12c00657"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const store=getFirestore(app)

export default app;