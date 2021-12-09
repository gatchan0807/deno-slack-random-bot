import { getFirestore, initializeApp } from "./deps.ts";

const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG") ?? "");
const reParsedFirebaseConfig = JSON.parse(firebaseConfig);
console.info(firebaseConfig);
console.info(reParsedFirebaseConfig);
console.info(typeof firebaseConfig);
console.info(typeof reParsedFirebaseConfig);
console.info(reParsedFirebaseConfig["projectId"]);
console.info(reParsedFirebaseConfig.projectId);
console.info(reParsedFirebaseConfig["appId"]);
console.info(reParsedFirebaseConfig.appId);

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
