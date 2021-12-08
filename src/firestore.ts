import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG") ?? "");
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
