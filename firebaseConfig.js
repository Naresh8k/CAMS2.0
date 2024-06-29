// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAJVnwHAv9m3_SKOuX8s1gOHUsuk7BsU_8",
  authDomain: "cams-c26da.firebaseapp.com",
  databaseURL: "https://cams-c26da-default-rtdb.firebaseio.com",
  projectId: "cams-c26da",
  storageBucket: "cams-c26da.appspot.com",
  messagingSenderId: "539147952635",
  appId: "1:539147952635:web:205218f9405c089241eb5e",
  measurementId: "G-Z0TXK2GG72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const database = getDatabase(app);


export { auth, database }