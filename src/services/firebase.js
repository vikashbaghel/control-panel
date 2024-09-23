import { initializeApp } from "@firebase/app";
import { getMessaging } from "@firebase/messaging";
import firebaseConfig from '../firebase.json';

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
