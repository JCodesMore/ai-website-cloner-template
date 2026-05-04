import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Lazy init — don't crash at build time when env vars missing
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

function getApp_(): FirebaseApp | null {
  if (_app) return _app;
  if (getApps().length > 0) { _app = getApp(); return _app; }
  if (!firebaseConfig.apiKey) return null;
  _app = initializeApp(firebaseConfig);
  return _app;
}

export function getClientAuth(): Auth | null {
  if (_auth) return _auth;
  const app = getApp_();
  if (!app) return null;
  _auth = getAuth(app);
  return _auth;
}

export function getClientDb(): Firestore | null {
  if (_db) return _db;
  const app = getApp_();
  if (!app) return null;
  _db = getFirestore(app);
  return _db;
}

export function getClientStorage(): FirebaseStorage | null {
  if (_storage) return _storage;
  const app = getApp_();
  if (!app) return null;
  _storage = getStorage(app);
  return _storage;
}
