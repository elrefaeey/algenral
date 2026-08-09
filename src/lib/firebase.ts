import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, enableNetwork, disableNetwork } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJe1ce-903bEiy1uTxMPDXnHvr2SArqSg",
  authDomain: "appp-ddcaf.firebaseapp.com",
  projectId: "appp-ddcaf",
  storageBucket: "appp-ddcaf.firebasestorage.app",
  messagingSenderId: "634609894893",
  appId: "1:634609894893:web:fe50ad273792972c8113e4",
  measurementId: "G-4QZQCP1Q3B"
};

export const app = initializeApp(firebaseConfig);
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Handle network connectivity
export const handleNetworkError = async () => {
  try {
    await disableNetwork(db);
    console.log('Firebase offline mode enabled');
    setTimeout(async () => {
      try {
        await enableNetwork(db);
        console.log('Firebase online mode restored');
      } catch (error) {
        console.warn('Failed to restore Firebase connection:', error);
      }
    }, 5000);
  } catch (error) {
    console.warn('Failed to handle network error:', error);
  }
};
