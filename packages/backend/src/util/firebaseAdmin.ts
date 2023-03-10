import { cert } from 'firebase-admin/app';
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';

export const firebaseAdmin = admin.initializeApp({
  credential: cert(JSON.parse(process.env.GOOGLE_CREDENTIALS)),
});
export const initFirebaseAdmin = () => {
  const firebaseApp = admin.initializeApp({
    credential: cert(JSON.parse(process.env.GOOGLE_CREDENTIALS)),
  });
  getAuth(firebaseApp);
};
