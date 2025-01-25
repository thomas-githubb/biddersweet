import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAgTdlWw6im2e_P60wDvkpKQgV-iBKk-gE",
  authDomain: "biddersweet-aede3.firebaseapp.com",
  projectId: "biddersweet-aede3",
  storageBucket: "biddersweet-aede3.firebasestorage.app",
  messagingSenderId: "89026277318",
  appId: "1:89026277318:web:fd936cc29451af71358cc7",
  databaseURL: "https://biddersweet-aede3-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app); 