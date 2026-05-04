import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { getClientDb } from "./config";

function db() {
  const d = getClientDb();
  if (!d) throw new Error("Firestore not configured");
  return d;
}
import type {
  FirestoreTour,
  FirestoreFAQ,
  FirestoreSeason,
  FirestoreGalleryItem,
  FirestoreBadge,
  FirestoreSiteConfig,
  FirestoreNavConfig,
} from "./types";

// ── Generic helpers ──

async function getCollection<T>(
  collectionName: string,
  publishedOnly = false
): Promise<(T & { id: string })[]> {
  let q = query(collection(db(), collectionName), orderBy("order", "asc"));
  if (publishedOnly) {
    q = query(
      collection(db(), collectionName),
      where("isPublished", "==", true),
      orderBy("order", "asc")
    );
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as T),
  }));
}

async function getDocument<T>(path: string): Promise<T | null> {
  const snap = await getDoc(doc(db(), path));
  return snap.exists() ? (snap.data() as T) : null;
}

async function setDocument(path: string, data: DocumentData) {
  await setDoc(doc(db(), path), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

async function updateDocument(path: string, data: DocumentData) {
  await updateDoc(doc(db(), path), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

async function deleteDocument(path: string) {
  await deleteDoc(doc(db(), path));
}

// ── Tours ──

export async function getTours(publishedOnly = false) {
  return getCollection<FirestoreTour>("tours", publishedOnly);
}

export async function getTourBySlug(slug: string) {
  return getDocument<FirestoreTour>(`tours/${slug}`);
}

export async function saveTour(slug: string, data: Partial<FirestoreTour>) {
  await setDocument(`tours/${slug}`, {
    ...data,
    slug,
    createdAt: data.createdAt || serverTimestamp(),
  });
}

export async function deleteTour(slug: string) {
  await deleteDocument(`tours/${slug}`);
}

// ── FAQs ──

export async function getFAQs(publishedOnly = false) {
  return getCollection<FirestoreFAQ>("faqs", publishedOnly);
}

export async function saveFAQ(id: string | null, data: Partial<FirestoreFAQ>) {
  if (id) {
    await updateDocument(`faqs/${id}`, data);
  } else {
    const ref = doc(collection(db(), "faqs"));
    await setDocument(`faqs/${ref.id}`, {
      ...data,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  }
}

export async function deleteFAQ(id: string) {
  await deleteDocument(`faqs/${id}`);
}

// ── Seasons ──

export async function getSeasons(publishedOnly = false) {
  return getCollection<FirestoreSeason>("seasons", publishedOnly);
}

export async function saveSeason(id: string | null, data: Partial<FirestoreSeason>) {
  if (id) {
    await updateDocument(`seasons/${id}`, data);
  } else {
    const ref = doc(collection(db(), "seasons"));
    await setDocument(`seasons/${ref.id}`, {
      ...data,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  }
}

export async function deleteSeason(id: string) {
  await deleteDocument(`seasons/${id}`);
}

// ── Gallery ──

export async function getGalleryItems(publishedOnly = false) {
  return getCollection<FirestoreGalleryItem>("gallery", publishedOnly);
}

export async function saveGalleryItem(id: string | null, data: Partial<FirestoreGalleryItem>) {
  if (id) {
    await updateDocument(`gallery/${id}`, data);
  } else {
    const ref = doc(collection(db(), "gallery"));
    await setDocument(`gallery/${ref.id}`, {
      ...data,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  }
}

export async function deleteGalleryItem(id: string) {
  await deleteDocument(`gallery/${id}`);
}

// ── Badges ──

export async function getBadges() {
  return getCollection<FirestoreBadge>("badges");
}

export async function saveBadge(id: string | null, data: Partial<FirestoreBadge>) {
  if (id) {
    await updateDocument(`badges/${id}`, data);
  } else {
    const ref = doc(collection(db(), "badges"));
    await setDocument(`badges/${ref.id}`, {
      ...data,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  }
}

export async function deleteBadge(id: string) {
  await deleteDocument(`badges/${id}`);
}

// ── Site Config ──

export async function getSiteConfig() {
  return getDocument<FirestoreSiteConfig>("config/site");
}

export async function saveSiteConfig(data: Partial<FirestoreSiteConfig>) {
  await setDocument("config/site", data);
}

// ── Navigation ──

export async function getNavConfig() {
  return getDocument<FirestoreNavConfig>("config/navigation");
}

export async function saveNavConfig(data: Partial<FirestoreNavConfig>) {
  await setDocument("config/navigation", data);
}
