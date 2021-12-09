import { getFirestore, initializeApp } from "./deps.ts";

const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG") ?? "");
console.info(firebaseConfig);
console.info(firebaseConfig["projectId"]);
console.info(firebaseConfig.projectId);
console.info(firebaseConfig["appId"]);
console.info(firebaseConfig.appId);

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
