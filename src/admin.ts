import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const app = getApps().length === 0
  ? initializeApp({ credential: cert(serviceAccount as any) })
  : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);


// import { getApps, initializeApp, cert } from "firebase-admin/app";
// import { getAuth } from "firebase-admin/auth";
// import { getFirestore } from "firebase-admin/firestore";
// import serviceAccount from "../secrets/interview-49b52-firebase-adminsdk-fbsvc-3c9a6babe7.json"; // ← import JSON directly

// const app = getApps().length === 0
//   ? initializeApp({ credential: cert(serviceAccount as any) })
//   : getApps()[0];

// export const auth = getAuth(app);
// export const db = getFirestore(app);
