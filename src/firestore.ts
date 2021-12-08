import { getFirestore, initializeApp } from "./deps.ts";

const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG") ?? "");
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
