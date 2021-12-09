import { getFirestore, initializeApp } from "./deps.ts";

const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG") ?? "");
console.info(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
