// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMLbAclcoQ5TqG6ChdjOljr-rzpIxAyyE",
  authDomain: "schedule-turni.firebaseapp.com",
  databaseURL: "https://schedule-turni-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "schedule-turni",
  storageBucket: "schedule-turni.firebasestorage.app",
  messagingSenderId: "28650674473",
  appId: "1:28650674473:web:31960ac8794029e50b3f38",
  measurementId: "G-Q0E5NG8658"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;