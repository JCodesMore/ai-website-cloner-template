import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// Lazy init — don't crash build when env vars missing
let _app: App | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

function getAdminApp(): App | null {
  if (_app) return _app;
  if (getApps().length > 0) { _app = getApps()[0]; return _app; }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("Firebase Admin SDK: missing env vars, running in fallback mode");
    return null;
  }

  _app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
  return _app;
}

export function getAdminAuth(): Auth | null {
  if (_auth) return _auth;
  const app = getAdminApp();
  if (!app) return null;
  _auth = getAuth(app);
  return _auth;
}

export function getAdminDb(): Firestore | null {
  if (_db) return _db;
  const app = getAdminApp();
  if (!app) return null;
  _db = getFirestore(app);
  return _db;
}
