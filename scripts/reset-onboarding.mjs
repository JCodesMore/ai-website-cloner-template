// Reset all onboarding docs in Firestore
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";

// Load env from .env.local
const env = readFileSync("/Users/majovega/Desktop/bajablue-videos/.env.local", "utf-8")
  .split("\n")
  .filter(l => l.includes("=") && !l.startsWith("#"))
  .reduce((acc, line) => {
    const [k, ...rest] = line.split("=");
    acc[k.trim()] = rest.join("=").trim().replace(/^"|"$/g, "");
    return acc;
  }, {});

const projectId = env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing Firebase Admin env vars in .env.local");
  process.exit(1);
}

initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore();

const snap = await db.collection("onboarding").get();
console.log(`Found ${snap.size} onboarding doc(s) to delete...`);

const batch = db.batch();
snap.forEach(doc => batch.delete(doc.ref));
await batch.commit();
console.log("✓ Cleared onboarding collection");
process.exit(0);
