// import admin from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';
import admin from 'firebase-admin';
export const firebaseAdmin = admin.initializeApp({
  credential: applicationDefault(),
});
