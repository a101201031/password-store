import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_AUTH_API_KEY,
  authDomain: 'password-store-831e7.firebaseapp.com',
  projectId: 'password-store-831e7',
  storageBucket: 'password-store-831e7.appspot.com',
  messagingSenderId: '301145456195',
  appId: '1:301145456195:web:067e0e075d9f2c0f1ddef6',
  measurementId: 'G-7NEQ9S9HDX',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
