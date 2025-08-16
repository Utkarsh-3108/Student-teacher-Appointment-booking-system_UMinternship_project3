// js/firebase-config.js
// Use as: <script type="module" src="js/firebase-config.js"></script>
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMDnGuGs-Lckzd3DJh1wbalHTOjyQ6f_8",
  authDomain: "student-teacher-system-96461.firebaseapp.com",
  projectId: "student-teacher-system-96461",
  storageBucket: "student-teacher-system-96461.appspot.com",
  messagingSenderId: "167560972827",
  appId: "1:167560972827:web:c1d681bb0e7f5a849086be",
  measurementId: "G-KV3VEHLS39"
};
const app = initializeApp(firebaseConfig);
try { getAnalytics(app); } catch (e) {}

window.firebaseApp = app;
window.auth = getAuth(app);
window.db = getFirestore(app);
window.firebaseFns = { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, query, where };
