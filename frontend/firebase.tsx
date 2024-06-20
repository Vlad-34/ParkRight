// Import the functions you need from the SDKs you need

import { FirebaseApp, initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCFty0DBF0uKUcp4cGNEh-jinYkz-wjIbU",

  authDomain: "parkright-44666.firebaseapp.com",

  projectId: "parkright-44666",

  storageBucket: "parkright-44666.appspot.com",

  messagingSenderId: "889653334043",

  appId: "1:889653334043:web:be83f239eba8ab321028be",
};

// Initialize Firebase

const app: FirebaseApp = initializeApp(firebaseConfig);

export default app;
