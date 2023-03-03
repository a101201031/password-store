import { cert } from 'firebase-admin/app';
import admin from 'firebase-admin';

export const firebaseAdmin = admin.initializeApp({
  credential: cert(JSON.parse(process.env.GOOGLE_CREDENTIALS)),
});
