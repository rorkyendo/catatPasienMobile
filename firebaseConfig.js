import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
export const firebaseConfig = {
  measurementId: 'G-measurement-id',
  apiKey: "AIzaSyBXNFw_Yz9ze1DiTvBH7bWLhM5W_RZuVnA",
  authDomain: "catatvaksin.firebaseapp.com",
  projectId: "catatvaksin",
  storageBucket: "catatvaksin.appspot.com",
  messagingSenderId: "832049279775",
  appId: "1:832049279775:web:b43f398fb8da7159ecb62a",
  measurementId: "G-V01T9FV98M"
};

export const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
