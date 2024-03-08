import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyAHdZe22M8zY4TcostVQn1mOIYTeYg2l8g",
  authDomain: "datapasien-a9a9f.firebaseapp.com",
  projectId: "datapasien-a9a9f",
  storageBucket: "datapasien-a9a9f.appspot.com",
  messagingSenderId: "747646199468",
  appId: "1:747646199468:web:3c567d8c62429160342109",
  measurementId: "G-XG7N0Q6YLK"
};

export const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
