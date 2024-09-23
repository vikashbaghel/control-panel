importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyAyqUVlLmbBbbyGB6gOufC5QA0j-1ZBu2c",
  authDomain: "rupyz-9a4b7.firebaseapp.com",
  projectId: "rupyz-9a4b7",
  storageBucket: "rupyz-9a4b7.appspot.com",
  messagingSenderId: "975445624764",
  appId: "1:975445624764:web:d851d18446a18c48accdb9",
  measurementId: "G-BQ52C3ZPTR",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "https://prod-rupyz-data.rupyz.com/static/documents/pub/5c73c47a5b70f82461b07d4bae8a5041_rupyz-logo-colored.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
