import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth,getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCh-i4fDnJ76WsbdFJn-2Oh-pT2F4wzQqM",
  authDomain: "medicine-3ff21.firebaseapp.com",
  projectId: "medicine-3ff21",
  storageBucket: "medicine-3ff21.firebasestorage.app",
  messagingSenderId: "521789138294",
  appId: "1:521789138294:web:6deaaf32b6c48e12c00657"
};

const app = initializeApp(firebaseConfig);
export const Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const store=getFirestore(app)

export default app;