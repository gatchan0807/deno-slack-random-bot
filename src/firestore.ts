import { getFirestore, initializeApp } from "./deps.ts";

const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG") ?? "");
const reParsedFirebaseConfig = JSON.parse(firebaseConfig);

const firebaseApp = initializeApp(reParsedFirebaseConfig);
export const db = getFirestore(firebaseApp);
