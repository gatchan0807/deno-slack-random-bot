import { getFirestore, initializeApp } from "./deps.ts";

const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG") ?? "");
console.info(firebaseConfig);
console.info(firebaseConfig["projectId"]);
console.info(initializeApp);

const firebaseApp = initializeApp(firebaseConfig);
console.info(firebaseApp);
export const db = getFirestore(firebaseApp);
