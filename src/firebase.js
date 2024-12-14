import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD-0TgXwfXh6l-OH_48RlLtYhvMIb3Ylxo",
  authDomain: "secretsanta-77d0a.firebaseapp.com",
  projectId: "secretsanta-77d0a",
  storageBucket: "secretsanta-77d0a.firebasestorage.app",
  messagingSenderId: "257366887022",
  appId: "1:257366887022:web:ed1e9b75a7ee94e60b347f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore, collection, addDoc };
