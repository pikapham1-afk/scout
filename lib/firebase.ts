import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDraFhIkC1gAQ_VGuTUQVlke7GhhCktDfY",
  authDomain: "scout-b546b.firebaseapp.com",
  projectId: "scout-b546b",
  storageBucket: "scout-b546b.firebasestorage.app",
  messagingSenderId: "515140800789",
  appId: "1:515140800789:web:833442fe76c4ae5b42191c",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);

export default app;