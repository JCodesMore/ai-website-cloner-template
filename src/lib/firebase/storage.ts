import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getClientStorage } from "./config";

export interface UploadProgress {
  progress: number;
  downloadURL?: string;
  error?: string;
}

export async function uploadFile(
  path: string,
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  const storageRef = ref(getClientStorage()!, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.({ progress });
      },
      (error) => {
        onProgress?.({ progress: 0, error: error.message });
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onProgress?.({ progress: 100, downloadURL });
        resolve(downloadURL);
      }
    );
  });
}

export async function deleteFile(path: string) {
  const storageRef = ref(getClientStorage()!, path);
  await deleteObject(storageRef);
}

export function getStoragePath(type: "tours" | "gallery" | "badges" | "hero" | "uploads", filename: string) {
  return `images/${type}/${Date.now()}_${filename}`;
}

export function getVideoStoragePath(filename: string) {
  return `videos/hero/${Date.now()}_${filename}`;
}
