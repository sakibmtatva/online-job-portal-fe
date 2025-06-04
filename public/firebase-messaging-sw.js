importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDZnAsjcVyNckT74K8qpE7-e1OWTeKZKqg",
  authDomain: "job-portal-797cd.firebaseapp.com",
  projectId: "job-portal-797cd",
  storageBucket: "job-portal-797cd.firebasestorage.app",
  messagingSenderId: "360135388956",
  appId: "1:360135388956:web:f34d41afa42b4f5636d4d9",
  measurementId: "G-J8PB1BNTHH"
});

const messaging = firebase.messaging();

// Add this to verify the service worker is properly initialized
console.log('Firebase messaging service worker initialized');

messaging.onBackgroundMessage((payload) => {
  console.log('[Firebase] Received background message: ', payload);
  
  if (!payload.notification) {
    console.error('[Firebase] Notification payload is missing');
    return;
  }

  const notificationTitle = payload.notification.title || 'New notification';
  const notificationOptions = {
    body: payload.notification.body || '',
    vibrate: [200, 100, 200],  // Add vibration pattern
    data: payload.data || {}
  };

  // Add notification click handler
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.notification.data && event.notification.data.url) {
      clients.openWindow(event.notification.data.url);
    }
  });

  self.registration.showNotification(notificationTitle, notificationOptions)
    .then(() => console.log('[Firebase] Notification shown successfully'))
    .catch(err => {
      console.error('[Firebase] Failed to show notification:', err);
      // Fallback to simple notification if rich notification fails
      self.registration.showNotification(notificationTitle, {
        body: notificationOptions.body
      });
    });
});