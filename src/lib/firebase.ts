import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDZnAsjcVyNckT74K8qpE7-e1OWTeKZKqg",
  authDomain: "job-portal-797cd.firebaseapp.com",
  projectId: "job-portal-797cd",
  storageBucket: "job-portal-797cd.firebasestorage.app",
  messagingSenderId: "360135388956",
  appId: "1:360135388956:web:f34d41afa42b4f5636d4d9",
  measurementId: "G-J8PB1BNTHH"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, { 
      vapidKey: "BPqmTmbjDJbh8_X158PAHYZtix94j7_Ms2Pmsr16qd4InuxRkCUjjBMqwvNUHDQFue5b2SR2GIeIgSNn8HUumvg" 
    });
    if (currentToken) {
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (err) {
    console.error('Error getting FCM token:', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });