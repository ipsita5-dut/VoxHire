// lib/firestore.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/client"; // client-side Firestore

export async function getUserDocument(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}
