import admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export const initFirebaseAdmin = () => {
  const firebaseApp = admin.initializeApp({
    credential: cert(JSON.parse(process.env.GOOGLE_CREDENTIALS)),
  });
  getAuth(firebaseApp);
};
