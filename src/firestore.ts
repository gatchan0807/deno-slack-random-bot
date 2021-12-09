import { getFirestore, initializeApp } from "./deps.ts";

const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG") ?? "");
const reParsedFirebaseConfig = typeof firebaseConfig === "string"
  ? JSON.parse(firebaseConfig)
  : firebaseConfig;

const firebaseApp = initializeApp(reParsedFirebaseConfig);
export const db = getFirestore(firebaseApp);
