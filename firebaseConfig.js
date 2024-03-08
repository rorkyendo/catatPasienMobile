import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBkFZbso3khWIohGFG-0D7gQkf1j3dzKHI",
  authDomain: "catatvaksin-70be4.firebaseapp.com",
  projectId: "catatvaksin-70be4",
  storageBucket: "catatvaksin-70be4.appspot.com",
  messagingSenderId: "921571678799",
  appId: "1:921571678799:web:e7ccec58b90af4f7a8e83a",
  measurementId: "G-6TJBVLBEB7"
};

export const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
