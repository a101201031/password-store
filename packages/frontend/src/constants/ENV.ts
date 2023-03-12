export const ENV = {
  API_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://server.alwayscoding.app'
      : 'http://localhost:8000/dev',
  FIREBASE_CONFIG: {
    apiKey: 'AIzaSyDTpGKHDgE0KInk7EJ2pvu2h1rmATD9H18',
    authDomain: 'password-store-831e7.firebaseapp.com',
    projectId: 'password-store-831e7',
    storageBucket: 'password-store-831e7.appspot.com',
    messagingSenderId: '301145456195',
    appId: '1:301145456195:web:067e0e075d9f2c0f1ddef6',
    measurementId: 'G-7NEQ9S9HDX',
  },
};
