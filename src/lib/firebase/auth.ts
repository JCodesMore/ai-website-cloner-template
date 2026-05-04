import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getClientAuth } from "./config";

export async function signIn(email: string, password: string) {
  const auth = getClientAuth();
  if (!auth) throw new Error("Firebase not configured");

  const result = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await result.user.getIdToken();

  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) throw new Error("Failed to create session");
  return result.user;
}

export async function signOut() {
  const auth = getClientAuth();
  if (auth) await firebaseSignOut(auth);
  await fetch("/api/auth/session", { method: "DELETE" });
}

export function onAuthChange(callback: (user: User | null) => void) {
  const auth = getClientAuth();
  if (!auth) { callback(null); return () => {}; }
  return onAuthStateChanged(auth, callback);
}
