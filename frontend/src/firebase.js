import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzSTiTLjl3I0wXZCRTj1KcX10iDOBJqpQ",
  authDomain: "projet-c87bb.firebaseapp.com",
  projectId: "projet-c87bb",
  storageBucket: "projet-c87bb.firebasestorage.app",
  messagingSenderId: "380958460952",
  appId: "1:380958460952:web:003be6f5ece7db3d08876d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
